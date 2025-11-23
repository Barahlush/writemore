import SafariServices
import WebKit

class SafariExtensionViewController: SFSafariExtensionViewController {

    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width: 400, height: 600)
        return shared
    }()

    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Create and configure WKWebView to display popup.html
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: view.bounds, configuration: webConfiguration)
        webView.autoresizingMask = [.width, .height]

        view.addSubview(webView)

        // Load popup.html
        if let htmlPath = Bundle.main.path(forResource: "popup", ofType: "html", inDirectory: "Resources") {
            let htmlUrl = URL(fileURLWithPath: htmlPath)
            let htmlFolder = htmlUrl.deletingLastPathComponent()
            webView.loadFileURL(htmlUrl, allowingReadAccessTo: htmlFolder)
        }
    }

}
