DESTDIR=
PREFIX=/usr
SYSCONFDIR=/etc

NPM:=$(shell which npm)
SYSTEMCTL:=$(shell which systemctl)

install:
	$(NPM) install
	if test -x "$(SYSTEMCTL)" && test -d "$(DESTDIR)$(SYSCONFDIR)/systemd/system"; then install -m0644 feedr.service $(DESTDIR)$(SYSCONFDIR)/systemd/system/feedr.service && $(SYSTEMCTL) daemon-reload; else echo "could not find systemd"; fi
	if test -e "$(DESTDIR)$(SYSCONFDIR)/systemd/system/feedr.service" && test ! -e "$(DESTDIR)$(SYSCONFDIR)/systemd/system/multi-user.target.wants/feedr.service"; then $(SYSTEMCTL) enable feedr.service && $(SYSTEMCTL) start feedr.service; else echo "feedr daemon is already enabled"; fi
