import SwiftUI

// MARK: - SesButton · 玉质玲珑钮
public struct SesButton: View {
    public enum Variant {
        case primary
        case cinnabar
        case ghost
        case gold
    }

    private let title: String
    private let variant: Variant
    private let action: () -> Void

    @Environment(\.songTheme) private var theme

    public init(_ title: String, variant: Variant = .primary, action: @escaping () -> Void) {
        self.title = title
        self.variant = variant
        self.action = action
    }

    public var body: some View {
        let p = theme.palette
        Button(action: action) {
            Text(title)
                .font(.system(.subheadline, design: .serif))
                .tracking(2)
                .padding(.horizontal, 18)
                .padding(.vertical, 9)
                .foregroundStyle(foregroundColor(p))
                .background(backgroundColor(p))
                .overlay(
                    RoundedRectangle(cornerRadius: 3)
                        .stroke(borderColor(p), lineWidth: 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: 3))
        }
        .buttonStyle(.plain)
    }

    private func foregroundColor(_ p: SongPalette) -> Color {
        switch variant {
        case .primary: return p.inkHeavy
        case .cinnabar: return p.cinnabar
        case .ghost: return p.inkMedium
        case .gold: return p.gold
        }
    }

    private func backgroundColor(_ p: SongPalette) -> Color {
        switch variant {
        case .primary: return p.moonWhite
        case .cinnabar: return p.cinnabar.opacity(0.08)
        case .ghost: return .clear
        case .gold: return p.gold.opacity(0.10)
        }
    }

    private func borderColor(_ p: SongPalette) -> Color {
        switch variant {
        case .primary: return p.celadonDeep.opacity(0.55)
        case .cinnabar: return p.cinnabar.opacity(0.45)
        case .ghost: return p.borderHairline
        case .gold: return p.borderGold
        }
    }
}

// MARK: - SesSeal · 朱文印章
public struct SesSeal: View {
    private let text: String
    private let green: Bool

    @Environment(\.songTheme) private var theme

    public init(_ text: String, green: Bool = false) {
        self.text = text
        self.green = green
    }

    public var body: some View {
        let p = theme.palette
        let color = green ? p.malachite : p.cinnabar
        Text(text)
            .font(.system(.caption, design: .serif).weight(.semibold))
            .tracking(1.5)
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .overlay(
                RoundedRectangle(cornerRadius: 2)
                    .stroke(color.opacity(0.75), lineWidth: 1.5)
            )
    }
}

// MARK: - SesCard · 宣纸界格卡片
public struct SesCard<Content: View>: View {
    private let content: Content
    @Environment(\.songTheme) private var theme

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        let p = theme.palette
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding(18)
        .background(p.bgElevated)
        .overlay(
            RoundedRectangle(cornerRadius: 4)
                .stroke(p.borderHairline, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 4))
    }
}

// MARK: - SesSwitch · 榫卯滑闩
public struct SesSwitch: View {
    @Binding private var isOn: Bool
    private let label: String?
    @Environment(\.songTheme) private var theme

    public init(_ label: String? = nil, isOn: Binding<Bool>) {
        self.label = label
        self._isOn = isOn
    }

    public var body: some View {
        let p = theme.palette
        HStack(spacing: 10) {
            Button {
                withAnimation(SongMotion.scrollEase(duration: 0.3)) {
                    isOn.toggle()
                }
            } label: {
                ZStack(alignment: isOn ? .trailing : .leading) {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(isOn ? p.celadon.opacity(0.35) : p.bgSubtle)
                        .frame(width: 44, height: 22)
                        .overlay(
                            RoundedRectangle(cornerRadius: 2)
                                .stroke(isOn ? p.celadonDeep : p.borderHairline, lineWidth: 1)
                        )
                    RoundedRectangle(cornerRadius: 1.5)
                        .fill(isOn ? p.celadonDeep : p.inkLight)
                        .frame(width: 16, height: 16)
                        .padding(3)
                }
            }
            .buttonStyle(.plain)

            if let label {
                Text(label)
                    .font(.system(.subheadline, design: .serif))
                    .foregroundStyle(p.inkHeavy)
            }
        }
    }
}

// MARK: - SesStepper · 筹算步进
public struct SesStepper: View {
    @Binding private var value: Int
    private let range: ClosedRange<Int>
    @Environment(\.songTheme) private var theme

    public init(value: Binding<Int>, in range: ClosedRange<Int> = 0...999) {
        self._value = value
        self.range = range
    }

    public var body: some View {
        let p = theme.palette
        HStack(spacing: 12) {
            SesButton("−", variant: .ghost) {
                if value > range.lowerBound { value -= 1 }
            }
            VStack(spacing: 2) {
                Text(SongCore.toSongCountingRods(value))
                    .font(.system(.title3, design: .serif))
                    .foregroundStyle(p.inkHeavy)
                Text("\(value)")
                    .font(.system(.caption2, design: .monospaced))
                    .foregroundStyle(p.inkLight)
            }
            .frame(minWidth: 56)
            SesButton("＋", variant: .ghost) {
                if value < range.upperBound { value += 1 }
            }
        }
    }
}

// MARK: - SesTag · 竹签牙牌
public struct SesTag: View {
    public enum Variant {
        case celadon, cinnabar, gold, ink
    }

    private let text: String
    private let variant: Variant
    @Environment(\.songTheme) private var theme

    public init(_ text: String, variant: Variant = .celadon) {
        self.text = text
        self.variant = variant
    }

    public var body: some View {
        let p = theme.palette
        let color: Color = switch variant {
        case .celadon: p.celadonDeep
        case .cinnabar: p.cinnabar
        case .gold: p.gold
        case .ink: p.inkMedium
        }

        HStack(spacing: 6) {
            Circle()
                .fill(color.opacity(0.75))
                .frame(width: 5, height: 5)
            Text(text)
                .font(.system(.caption, design: .serif))
                .tracking(1.5)
        }
        .foregroundStyle(color)
        .padding(.horizontal, 10)
        .padding(.vertical, 4)
        .background(color.opacity(0.10))
        .overlay(
            RoundedRectangle(cornerRadius: 2)
                .stroke(color.opacity(0.45), lineWidth: 1)
        )
    }
}
