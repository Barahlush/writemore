import Cocoa
import SafariServices

class ViewController: NSViewController {

    @IBOutlet weak var appNameLabel: NSTextField!
    @IBOutlet weak var statusLabel: NSTextField!
    @IBOutlet weak var enableButton: NSButton!

    override func viewDidLoad() {
        super.viewDidLoad()

        setupUI()
        checkExtensionStatus()
    }

    func setupUI() {
        appNameLabel.stringValue = "📚 Mindful Reading"
        appNameLabel.font = NSFont.systemFont(ofSize: 24, weight: .bold)

        statusLabel.stringValue = "Welcome to Mindful Reading!"
        statusLabel.font = NSFont.systemFont(ofSize: 14)

        enableButton.title = "Open Safari Extensions Preferences"
    }

    func checkExtensionStatus() {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: "com.mindfulreading.MindfulReading-Extension") { (state, error) in
            DispatchQueue.main.async {
                if let state = state {
                    if state.isEnabled {
                        self.statusLabel.stringValue = "✓ Extension is enabled in Safari"
                        self.statusLabel.textColor = .systemGreen
                        self.enableButton.isHidden = true
                    } else {
                        self.statusLabel.stringValue = "Extension is not enabled. Click below to enable it."
                        self.statusLabel.textColor = .systemOrange
                    }
                } else if let error = error {
                    self.statusLabel.stringValue = "Error: \(error.localizedDescription)"
                    self.statusLabel.textColor = .systemRed
                }
            }
        }
    }

    @IBAction func openSafariExtensionPreferences(_ sender: Any) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: "com.mindfulreading.MindfulReading-Extension") { error in
            if let error = error {
                DispatchQueue.main.async {
                    let alert = NSAlert()
                    alert.messageText = "Error"
                    alert.informativeText = error.localizedDescription
                    alert.alertStyle = .warning
                    alert.addButton(withTitle: "OK")
                    alert.runModal()
                }
            }
        }
    }

    override var representedObject: Any? {
        didSet {
            // Update the view, if already loaded.
        }
    }

}
