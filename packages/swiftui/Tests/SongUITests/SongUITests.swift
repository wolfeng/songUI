import XCTest
@testable import SongUI

final class SongUITests: XCTestCase {
    func testCountingRodsMatchCoreSpec() {
        XCTAssertEqual(SongCore.toSongCountingRods(27), "二 〧")
        XCTAssertEqual(SongCore.toSongCountingRods(5), "〥")
        XCTAssertEqual(SongCore.toSongCountingRods(0), "〇")
    }

    func testShichenAndNightWatchMatchCoreSpec() {
        XCTAssertEqual(SongCore.getShichenName(totalMinutes: 0), "子正")
        XCTAssertEqual(SongCore.getShichenName(totalMinutes: 720), "午正")
        let midnight = SongCore.getNightWatchLabel(totalMinutes: 0)
        XCTAssertTrue(midnight.isNight)
        XCTAssertEqual(midnight.text, "三更三点")
        XCTAssertEqual(midnight.ratio, 0.5, accuracy: 0.01)
    }

    func testValidationRules() {
        let rules = [SongRules.required(), SongRules.minLength(3)]
        XCTAssertEqual(SongRules.validate("", rules: rules), ["此项须落墨填具，不可留白", "文辞至少须 3 字"])
        XCTAssertEqual(SongRules.validate("清明上河", rules: rules), [])
        XCTAssertEqual(SongRules.validate(15, rules: [SongRules.range(1, 10)]), ["数值须介于 1 至 10 之间"])
    }
}
