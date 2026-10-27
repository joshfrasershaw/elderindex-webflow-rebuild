// Factual publication candidates; legal approval remains an owner gate.
// Do not infer a legal entity, lawful basis, retention schedule or supplier terms.
export function applyLegal(pages,config){
 const page=path=>pages.find(p=>p.path===path);
 Object.assign(page('/privacy/'),{
  intro:'How this website handles enquiries and technical information. Draft pending the operator’s final confirmation.',
  sections:[
   ['Who to contact','For website and privacy questions, contact ElderIndex at hello@elderindex.co.uk or [use the enquiry page](/talk-to-us/). The operator’s full legal identity and contact address must be confirmed before this draft is approved.'],
   ['Information in an enquiry','The form asks for a name, work email and message. Depending on the form, you can also supply an organisation, existing website and selected services. We use this information to respond to your enquiry and discuss the work you requested. Please do not include confidential or sensitive information about residents, clients or people receiving care.'],
   ['How the enquiry is processed','Your browser sends the entered fields directly to Formspree over HTTPS. The website displays confirmation only after Formspree accepts the submission. The site does not contain its own enquiry database; receipt and onward delivery are managed through the operator’s Formspree and email arrangements.','See [Formspree’s privacy information](https://formspree.io/legal/privacy-policy/). The operator must confirm the applicable account terms, email provider, retention and any international processing before approving this notice.'],
   ['Hosting and technical requests','Cloudflare hosts this replacement website. Loading pages and assets involves network information, such as an IP address and browser information. Provider logging and retention depend on the applicable services and account settings; they are not determined by the enquiry form.'],
   ['Analytics',config.measurementId?'Google Analytics is configured but loads only after you allow it. The website’s tracking code does not send form contents, email addresses or phone numbers as analytics event parameters. See the [cookie information](/cookies/) to review or change your preference.':'Google Analytics is not configured in this build. The website does not load GA4 or advertising pixels, and enquiry contents are not sent to analytics. See the [cookie information](/cookies/) for the current controls.'],
   ['Privacy requests','Contact ElderIndex using the published email address for questions or requests about your information. You can also consult the [Information Commissioner’s Office](https://ico.org.uk/for-the-public/) for information about UK data-protection rights.'],
   ['Draft approval status','This notice is awaiting confirmation of the operator’s legal identity and address, processing basis, retention arrangements, suppliers and international processing. It does not claim that those legal decisions have already been approved.']
  ]
 });
 Object.assign(page('/terms/'),{
  intro:'Information about this website and how project arrangements are agreed. Draft pending final business and legal approval.',
  sections:[
   ['Website information','ElderIndex describes website design, management, SEO and directory support for care providers. The guides offer general website and marketing information, not individual care, clinical or legal advice. Search rankings, enquiries, admissions and occupancy are not guaranteed.'],
   ['Examples and illustrations','Design concepts and fictional worked examples are labelled as illustrations, not completed client projects or case studies. Stock photographs do not show ElderIndex clients or team members.'],
   ['Project and support arrangements','Individual projects and ongoing services require an agreed scope, responsibilities, pricing, access and terms in writing. Website management and ongoing SEO are separate choices, not compulsory additions to a website build. Care providers approve factual and regulated statements about their own services.'],
   ['Other websites and platforms','Linked directories and platforms control their own features, permissions and commercial terms. A link does not imply an official partnership or control over a platform’s ranking or decisions. Check the agreement offered to your business before making a purchase.'],
   ['Contact and approval status','Contact ElderIndex through [the enquiry page](/talk-to-us/) or hello@elderindex.co.uk. The operator must confirm legal business details and approve applicable intellectual-property, liability and governing-law terms before treating this draft as final. This draft does not include a liability waiver or set out a service contract.']
  ]
 });
 Object.assign(page('/cookies/'),{
  intro:'The cookies, browser storage and external requests used by this website. Draft pending the operator’s final confirmation.',
  sections:[
   ['Website technology','Fonts, styles, scripts and photographs are served with the website. The site does not embed advertising networks or social-media tracking pixels. Hosting services can process technical requests independently of the website’s own code.'],
   ['Browser storage',config.measurementId?'An analytics choice is stored in this browser’s local storage for up to 180 days. Allowing analytics enables Google Analytics; rejecting it leaves analytics off. The preference can be changed using Analytics preferences. Revoking consent disables the configured analytics ID and clears accessible GA analytics cookies.':'With analytics disabled, the website code does not set analytics cookies or store an analytics preference in local storage. Analytics preference controls are not shown while analytics is disabled.'],
   ['Enquiry requests','Sending a form makes a request to Formspree with the fields you entered. That is separate from analytics. See the [privacy notice](/privacy/) and [Formspree’s privacy information](https://formspree.io/legal/privacy-policy/) for the enquiry-processing context.'],
   ['Review when services change','The operator must check the actual hosting and form account settings before approval and review this notice if tracking, embedded services or platform settings change. A browser observation is not a guarantee that a third-party provider will never use cookies. For questions, contact hello@elderindex.co.uk.']
  ]
 });
}
