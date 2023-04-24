cargo build --target wasm32-wasi --release
wasm-tools component new ./target/wasm32-wasi/release/commit_summary.wasm -o $1 --adapt ../../wasi_snapshot_preview1.wasm
