import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {

    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // Handle messages from content scripts
        page.getPropertiesWithCompletionHandler { properties in
            NSLog("Message received from page: \(messageName)")
        }
    }

    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This is called when the extension's toolbar icon is clicked
    }

    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // Validate the toolbar item
        validationHandler(true, "")
    }

    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

    override func popoverWillShow(in window: SFSafariWindow) {
        // Called before the popover is shown
    }

    override func popoverDidClose(in window: SFSafariWindow) {
        // Called after the popover is closed
    }

}
