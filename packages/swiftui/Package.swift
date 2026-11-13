// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SongUI",
    platforms: [
        .macOS(.v14),
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "SongUI",
            targets: ["SongUI"]
        )
    ],
    targets: [
        .target(
            name: "SongUI"
        ),
        .testTarget(
            name: "SongUITests",
            dependencies: ["SongUI"]
        )
    ]
)
