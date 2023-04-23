wit_bindgen::generate!({
    path: "../../wit"
});

struct MyHost;

impl Host for MyHost {
    fn run() {
        let (status, output) = host_exec("git diff --cached");
        if status != 0 {
            println!("Error: {}", output);
            return;
        }

        host_loading(true);

        let prompt = r#"Suggest a few more commit messages for my changes (without explanations) following conventional commit (<type>: <subject>). I will give you the diff text and you give me the results as a list, not more than 6 items"#;
        let prompt = format!("{prompt}\n {output}");
        let (code, result) = host_openai(&prompt);

        if code != 0 {
            println!("Error: {}", result);
            return;
        }

        host_loading(false);

        let options = result
            .lines()
            .map(|opt| opt.split_once('.').unwrap().1.trim())
            .collect::<Vec<&str>>();

        let result = host_select(&options);
        if let Some(result) = result {
            let cmd = format!("git commit -m \"{}\"", result);
            println!("Executing: {cmd}");
            host_exec(&cmd);
        }
    }
}

export_host!(MyHost);
