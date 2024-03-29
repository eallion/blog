export default function handler(req, res) {
    res.send(`{
        "subject": "acct:eallion@eallion.com",
        "aliases": [
            "https://m.eallion.com/users/eallion",
            "https://m.eallion.com/@eallion"
        ],
        "links": [
            {
                "rel": "http://webfinger.net/rel/profile-page",
                "type": "text/html",
                "href": "https://m.eallion.com/@eallion"
            },
            {
                "rel": "self",
                "type": "application/activity+json",
                "href": "https://m.eallion.com/users/eallion"
            }
        ]
    }`);
}
