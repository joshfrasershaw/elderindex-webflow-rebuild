# Editorial image sources and placement record

Reviewed 26 October 2026. All 29 photographs were visually reviewed and downloaded from Pexels. The [Pexels licence](https://www.pexels.com/license/) permits website use and modification; it does not permit implying endorsement by the people or brands pictured. The images illustrate care, domestic settings and digital work. They do not depict ElderIndex’s own premises, staff or clients, and the homes in design concepts are illustrative.

Every source photograph appears in exactly one rendered placement across the whole site. This includes different photographs on the homepage and guide-hub cards, and different laptop/phone concept imagery. Responsive resolutions are variants of the same photograph, not additional images. Shared logos and social-sharing artwork are branding rather than editorial photographs.

All responsive variants are local WebP files in `public/assets/photos/`. `src/imagery.json` is the maintained manifest: source IDs, photographers, source/licence URLs, review date, accurate alt descriptions, focal points, original hashes and variant hashes/dimensions. `src/imagery.mjs` renders each explicit page/slot assignment. `npm run check` rejects duplicate source IDs, duplicate originals, unused assignments and missing or changed assets. Browser tests decode all 29 at desktop and mobile widths.

| Page | Placement | Pexels photo | Photographer |
| --- | --- | --- | --- |
| / | laptop | [37291570](https://www.pexels.com/photo/charming-english-cottage-with-lush-garden-37291570/) | Neville Hawkins |
| / | phone | [28539228](https://www.pexels.com/photo/modern-living-room-with-indoor-outdoor-design-28539228/) | Damm aaaa |
| / | story | [8088906](https://www.pexels.com/photo/elderly-couple-smiling-while-looking-at-each-other-8088906/) | Yaroslav Shuraev |
| / | residential-concept | [37095303](https://www.pexels.com/photo/charming-brick-house-with-floral-vine-exterior-37095303/) | Neville Hawkins |
| / | domiciliary-concept | [7551686](https://www.pexels.com/photo/a-man-and-a-woman-assisting-an-elderly-man-in-standing-7551686/) | Kampus Production |
| / | Guide: choosing-a-care-website | [10847181](https://www.pexels.com/photo/sofas-in-a-living-room-10847181/) | Đỗ Huy Hoàng |
| / | Guide: home-care-local-seo | [8062289](https://www.pexels.com/photo/gray-laptop-beside-white-printer-paper-8062289/) | Nataliya Vaitkevich |
| / | Guide: care-directory-comparison | [6248436](https://www.pexels.com/photo/smiling-senior-using-tablet-6248436/) | Kampus Production |
| /services/ | overview | [8584020](https://www.pexels.com/photo/brown-couch-in-the-living-room-8584020/) | Curtis Adams |
| /services/website-design/ | hero | [7027771](https://www.pexels.com/photo/the-interior-of-a-living-room-of-a-house-7027771/) | Curtis Adams |
| /services/website-design/ | interlude | [4443134](https://www.pexels.com/photo/a-man-writing-on-the-notebook-4443134/) | Polina Tankilevitch |
| /services/search-visibility/ | interlude | [7947999](https://www.pexels.com/photo/person-using-black-and-gray-laptop-7947999/) | RDNE Stock project |
| /services/website-management/ | interlude | [7679449](https://www.pexels.com/photo/a-woman-making-a-content-plan-using-a-laptop-7679449/) | MART  PRODUCTION |
| /services/care-directory-management/ | interlude | [8871432](https://www.pexels.com/photo/side-view-of-a-woman-in-the-couch-holding-a-picture-frame-8871432/) | Kampus Production |
| /services/home-care/ | hero | [5793547](https://www.pexels.com/photo/interior-of-a-living-room-5793547/) | Mariette de Villiers |
| /services/home-care/ | interlude | [7551583](https://www.pexels.com/photo/people-smiling-together-7551583/) | Kampus Production |
| /services/care-home-seo/ | hero | [14714646](https://www.pexels.com/photo/living-room-with-retro-decor-14714646/) | Wellington Silva |
| /services/care-home-seo/ | interlude | [18459198](https://www.pexels.com/photo/caregiver-helping-elderly-people-in-nursing-home-18459198/) | Jsme  MILA   |
| /for-care-homes/ | hero | [37178437](https://www.pexels.com/photo/historic-english-manor-with-scenic-garden-pathway-37178437/) | Phil Ledwith |
| /for-care-homes/ | interlude | [18459207](https://www.pexels.com/photo/seniors-by-table-in-nursing-home-18459207/) | Jsme  MILA   |
| /for-home-care-agencies/ | hero | [7546648](https://www.pexels.com/photo/interior-design-of-room-7546648/) | Max Vakhtbovych |
| /for-home-care-agencies/ | interlude | [6923486](https://www.pexels.com/photo/couple-showing-affection-6923486/) | cottonbro studio |
| /about/ | hero | [18429308](https://www.pexels.com/photo/a-caregiver-talking-to-a-group-of-seniors-sitting-at-a-table-18429308/) | Jsme  MILA   |
| /guides/ | Guide: choosing-a-care-website | [7983606](https://www.pexels.com/photo/woman-sitting-on-table-holding-digital-tablet-7983606/) | Kampus Production |
| /guides/ | Guide: home-care-local-seo | [7278882](https://www.pexels.com/photo/gray-and-black-laptop-on-the-table-7278882/) |  Anastasia  Shuraeva |
| /guides/ | Guide: care-directory-comparison | [7983611](https://www.pexels.com/photo/an-elderly-man-using-a-tablet-7983611/) | Kampus Production |
| /guides/ | Guide: carehome-co-uk-profile | [37441096](https://www.pexels.com/photo/beautiful-english-cottage-garden-in-bloom-37441096/) | Neville Hawkins |
| /guides/ | Guide: google-business-profile-care | [6972643](https://www.pexels.com/photo/photo-of-an-elderly-man-writing-6972643/) | Mikhail Nilov |
| /guides/ | Guide: multi-location-home-care-seo | [8145328](https://www.pexels.com/photo/persons-using-laptops-on-table-with-charts-8145328/) | olia danilevich |
