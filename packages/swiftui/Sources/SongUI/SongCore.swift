import Foundation

/// Framework-agnostic primitives ported 1:1 from @song-ui/core
public enum SongCore {
    public struct NightWatchInfo: Equatable, Sendable {
        public let isNight: Bool
        public let text: String
        public let ratio: Double
    }

    private static let verticalRods = ["〇", "〡", "〢", "〣", "〤", "〥", "〦", "〧", "〨", "〩"]
    private static let horizontalRods = ["〇", "一", "二", "三", "四", "〦", "〧", "〨", "〩", "〩"]
    private static let shichenNames = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    private static let gengNames = ["初更", "二更", "三更", "四更", "五更"]
    private static let dianNames = ["一点", "二点", "三点", "四点", "五点"]

    public static func toSongCountingRods(_ value: Int) -> String {
        let clamped = max(0, value)
        if clamped == 0 { return "〇" }
        let digits = String(clamped).compactMap { Int(String($0)) }
        let total = digits.count
        var parts: [String] = []
        for (idx, digit) in digits.enumerated() {
            let powerFromRight = total - 1 - idx
            let useVertical = powerFromRight % 2 == 0
            parts.append(useVertical ? verticalRods[digit] : horizontalRods[digit])
        }
        return parts.joined(separator: " ")
    }

    public static func getShichenName(totalMinutes: Int) -> String {
        let m = ((totalMinutes % 1440) + 1440) % 1440
        let shifted = (m + 60) % 1440
        let index = Int(floor(Double(shifted) / 120.0))
        let offset = shifted % 120
        let phase = offset < 60 ? "初" : "正"
        return "\(shichenNames[index])\(phase)"
    }

    public static func getNightWatchLabel(totalMinutes: Int) -> NightWatchInfo {
        let m = ((totalMinutes % 1440) + 1440) % 1440
        let isNight = m >= 1140 || m < 300
        if isNight {
            let nightMins = m >= 1140 ? m - 1140 : m + 300
            let ratio = Double(nightMins) / 600.0
            let gengIdx = min(4, Int(floor(Double(nightMins) / 120.0)))
            let dianIdx = min(4, Int(floor(Double(nightMins % 120) / 24.0)))
            return NightWatchInfo(
                isNight: true,
                text: "\(gengNames[gengIdx])\(dianNames[dianIdx])",
                ratio: ratio
            )
        } else {
            let dayMins = m - 300
            let ratio = Double(dayMins) / 840.0
            let ke = Int(floor(Double(m) / 14.4)) + 1
            return NightWatchInfo(
                isNight: false,
                text: "昼漏第\(ke)刻",
                ratio: ratio
            )
        }
    }

    public static func getSundialShadowAngle(totalMinutes: Int) -> Double {
        let m = ((totalMinutes % 1440) + 1440) % 1440
        return Double(m - 720) * 0.25
    }

    public static func formatIncenseDuration(seconds: Int) -> String {
        let clamped = max(0, seconds)
        let mins = clamped / 60
        let secs = clamped % 60
        return String(format: "%02d:%02d", mins, secs)
    }
}

public enum SongValidationResult: Equatable, Sendable {
    case valid
    case invalid(String)

    public var isValid: Bool {
        if case .valid = self { return true }
        return false
    }

    public var errorMessage: String? {
        if case .invalid(let msg) = self { return msg }
        return nil
    }
}

public typealias SongValidationRule<T> = @Sendable (T) -> SongValidationResult

public enum SongRules {
    public static func required(_ message: String = "此项须落墨填具，不可留白") -> SongValidationRule<String> {
        { value in
            value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? .invalid(message) : .valid
        }
    }

    public static func minLength(_ min: Int, message: String? = nil) -> SongValidationRule<String> {
        { value in
            let len = value.trimmingCharacters(in: .whitespacesAndNewlines).count
            return len >= min ? .valid : .invalid(message ?? "文辞至少须 \(min) 字")
        }
    }

    public static func range(_ min: Int, _ max: Int, message: String? = nil) -> SongValidationRule<Int> {
        { value in
            (value >= min && value <= max) ? .valid : .invalid(message ?? "数值须介于 \(min) 至 \(max) 之间")
        }
    }

    public static func validate<T>(_ value: T, rules: [SongValidationRule<T>]) -> [String] {
        rules.compactMap { $0(value).errorMessage }
    }
}
