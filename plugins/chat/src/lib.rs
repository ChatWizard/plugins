wit_bindgen::generate!({
    path: "../../wit"
});

struct Plugin;

impl Host for Plugin {
    fn run() {
        while let Some(prompt) = host_input("Question:") {
            host_loading(true);
            let id = host_openai_stream(&prompt);
            while let Some(msg) = host_receive(&id) {
                host_loading(false);
                match msg {
                    Ok(msg) => {
                        host_print(&msg);
                    }
                    Err(err) => {
                        println!("{}", err);
                        return;
                    }
                }
            }
            println!();
        }
    }
}

export_host!(Plugin);
