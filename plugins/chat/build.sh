cargo build --target wasm32-wasi --release
wasm-tools component new ./target/wasm32-wasi/release/chat.wasm -o $1 --adapt ../../wasi_snapshot_preview1.wasm
