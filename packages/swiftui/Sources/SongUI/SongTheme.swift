import SwiftUI
import Observation

public enum SongThemeName: String, CaseIterable, Sendable {
    case light
    case dark
}

public struct SongPalette: Sendable {
    public let bgSidebar: Color
    public let bgCanvas: Color
    public let bgElevated: Color
    public let bgSubtle: Color
    public let celadon: Color
    public let celadonDeep: Color
    public let moonWhite: Color
    public let inkHeavy: Color
    public let inkMedium: Color
    public let inkLight: Color
    public let cinnabar: Color
    public let malachite: Color
    public let azurite: Color
    public let gold: Color
    public let borderHairline: Color
    public let borderGold: Color

    public static let light = SongPalette(
        bgSidebar: SongColors.Light.bgSidebar,
        bgCanvas: SongColors.Light.bgCanvas,
        bgElevated: SongColors.Light.bgElevated,
        bgSubtle: SongColors.Light.bgSubtle,
        celadon: SongColors.Light.celadon,
        celadonDeep: SongColors.Light.celadonDeep,
        moonWhite: SongColors.Light.moonWhite,
        inkHeavy: SongColors.Light.inkHeavy,
        inkMedium: SongColors.Light.inkMedium,
        inkLight: SongColors.Light.inkLight,
        cinnabar: SongColors.Light.cinnabar,
        malachite: SongColors.Light.malachite,
        azurite: SongColors.Light.azurite,
        gold: SongColors.Light.gold,
        borderHairline: SongColors.Light.borderHairline,
        borderGold: SongColors.Light.borderGold
    )

    public static let dark = SongPalette(
        bgSidebar: SongColors.Dark.bgSidebar,
        bgCanvas: SongColors.Dark.bgCanvas,
        bgElevated: SongColors.Dark.bgElevated,
        bgSubtle: SongColors.Dark.bgSubtle,
        celadon: SongColors.Dark.celadon,
        celadonDeep: SongColors.Dark.celadonDeep,
        moonWhite: SongColors.Dark.moonWhite,
        inkHeavy: SongColors.Dark.inkHeavy,
        inkMedium: SongColors.Dark.inkMedium,
        inkLight: SongColors.Dark.inkLight,
        cinnabar: SongColors.Dark.cinnabar,
        malachite: SongColors.Dark.malachite,
        azurite: SongColors.Dark.azurite,
        gold: SongColors.Dark.gold,
        borderHairline: SongColors.Dark.borderHairline,
        borderGold: SongColors.Dark.borderGold
    )
}

@Observable
public final class SongTheme {
    public var current: SongThemeName

    public var palette: SongPalette {
        current == .dark ? .dark : .light
    }

    public init(current: SongThemeName = .light) {
        self.current = current
    }

    public func toggle() {
        withAnimation(SongMotion.scrollEase(duration: 0.45)) {
            current = (current == .dark) ? .light : .dark
        }
    }
}

private struct SongThemeKey: EnvironmentKey {
    static let defaultValue = SongTheme()
}

public extension EnvironmentValues {
    var songTheme: SongTheme {
        get { self[SongThemeKey.self] }
        set { self[SongThemeKey.self] = newValue }
    }
}
