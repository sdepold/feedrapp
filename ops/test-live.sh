if curl -Ls "https://feedrapp.info" | grep -q "Introduction"; then
    echo "Feedr Website: Works"
else
    echo "Feedr Website: Unavailable"
fi

if curl -Ls "https://feedrapp.info/hosting" | grep -q "Hosting"; then
    echo "Feedr Website (Hosting): Works"
else
    echo "Feedr Website (Hosting): Unavailable"
fi

if curl -Ls "https://feedrapp.info/?q=https://bitte.kaufen/magazin/feed/" | grep -q "bitte.kaufen Magazin für Eltern"; then
    echo "Feedr API (forwarding): Works"
else
    echo "Feedr API (forwarding): Unavailable"
fi

if curl -Ls "https://feedrapp.info/api/?q=https://bitte.kaufen/magazin/feed/" | grep -q "bitte.kaufen Magazin für Eltern"; then
    echo "Feedr API: Works"
else
    echo "Feedr API: Unavailable"
fi

if curl -Ls "https://feedrapp.info/api?q=https://bitte.kaufen/magazin/feed/" | grep -q "bitte.kaufen Magazin für Eltern"; then
    echo "Feedr API (no trailing slash): Works"
else
    echo "Feedr API (no trailing slash): Unavailable"
fi

if curl -Ls "https://feedrapp.info/api?callback=foo&q=https://bitte.kaufen/magazin/feed/" | grep -q 'foo({"responseStatus":200'; then
    echo "Feedr API (callback): Works"
else
    echo "Feedr API (callback): Unavailable"
fi