cargo build --target wasm32-wasi --release
wasm-tools component new ./target/wasm32-wasi/release/commit_summary.wasm -o built/commit_summary.wasm --adapt ../../wasi_snapshot_preview1.wasm
