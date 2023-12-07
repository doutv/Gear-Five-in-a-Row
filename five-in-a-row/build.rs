use gear_wasm_builder::WasmBuilder;
use gmeta::Metadata;
use five_in_a_row_io::ContractMetadata;

fn main() {
    WasmBuilder::with_meta(ContractMetadata::repr())
        .exclude_features(vec!["binary-vendor"])
        .build();
}
