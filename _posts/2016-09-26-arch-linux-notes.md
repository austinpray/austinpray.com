Just some notes from installing Arch Linux. Will come back and clean this article up.

## Don't Forget

Install and enable NTPD https://wiki.archlinux.org/index.php/Network_Time_Protocol_daemon

## GUI and Graphics

Nvidia GTX 1070 -> install `nvidia` package. `nvidia-libgl` fine.

`lightdm` + `i3` + `termite`

Replace dmenu with https://github.com/enkore/j4-dmenu-desktop <-- sooo dope

## Japanese Fonts

Don't forget your Japanese fonts if you are an insufferable weeb. 

`sudo pacman -S adobe-source-han-sans-jp-fonts`
`sudo pacman -S otf-ipafont`

## Virtualbox and Vagrant

https://wiki.archlinux.org/index.php/VirtualBox#Installation_steps_for_Arch_Linux_hosts
https://wiki.archlinux.org/index.php/Vagrant

`pacman -S virtualbox vagrant` and then choose `virtualbox-host-modules-arch`.

You are gonna probably need nfs https://wiki.archlinux.org/index.php/NFS

I had to install `net-tools` to get nfs working.

## Installed Packages List

Packages list last updated: 2019-09-22

```arch-packages
adobe-source-han-sans-jp-fonts
alsa-utils
antibody-bin
apvlv
arandr
at
audacity
autoconf
autojump
automake
avidemux-qt
aws-cli
baka-mplayer
baobab
bash
beep
bind-tools
binutils
bison
brother-brgenml1
btrfs-progs
bzip2
certbot
chromium
cli-visualizer
colordiff
compton
coreutils
cower
cowsay
cronie
cryptsetup
cups-pdf
deepin-screenshot
device-mapper
dhcpcd
diff-so-fancy
diffutils
discord
dmenu
docker
docker-compose
dolphin
dolphin-plugins
dos2unix
dosfstools
dunst
e2fsprogs
efibootmgr
escrotum-git
fakeroot
fbida
fbv
feh
ffmpeg
file
filesystem
findutils
firefox
flatpak
flent
flex
fluxctl-bin
foomatic-db-engine
foomatic-db-nonfree-ppds
foomatic-db-ppds
foxitreader
fzf
gawk
gcc
gcc-libs
gettext
gifsicle
git
git-lfs
glibc
gnome-keyring
gnome-system-monitor
google-chrome
gotty
gparted
gradle
graphviz
grep
gvim
gzip
highlight
htop
http-parser
hub
i3-wm
i3lock
i3status
ibus
ibus-mozc
imlib2
inetutils
input-utils
iproute2
iputils
j4-dmenu-desktop
jdk8-openjdk
jetbrains-toolbox
jfsutils
jpegoptim
jq
kakasi
kanjistrokeorders-ttf
keybase-bin
keychain
kitty
klavaro
kompose-bin
kubebox
kubectl
kubectx
less
libmcrypt
libreoffice-fresh
libtool
licenses
linux
logrotate
losslesscut
lshw
lvm2
lxc
m4
make
man-db
man-pages
mariadb-clients
masterpdfeditor
mdadm
mecab-ipadic
meh-git
meld
mplayer
mupdf
nano
neoleo
net-tools
netctl
network-manager-applet
networkmanager
nfs-utils
notification-daemon
npm
ntfs-3g
nvidia
nvidia-settings
ocaml
openssh
os-prober
otf-ipafont
oxygen
oxygen-icons
p7zip
pacaur
pacgraph
pacman
pacman-contrib
parallel
patch
pavucontrol
pciutils
perl
perl-rename
pkgconf
pkgfile
pkgtools
plantuml
poppler
postgresql
print-manager
procps-ng
psmisc
pulseaudio
pulseaudio-alsa
pup-git
pwgen
python-beautifulsoup4
python-cairo
python-gobject
python-html5lib
python-pawk
python-pip
python-protobuf
python-webencodings
python2-virtualenv
qt4
qt5-styleplugins
qt5ct
ranger
re2c
redshift
reiserfsprogs
ripgrep
rsync
rxvt
rxvt-unicode
s-nail
sbt
sc-im
scala
seahorse
sed
selfspy-git
shadow
silver-searcher-git
smartmontools
sshfs
sudo
sux
sway
sysfsutils
system-config-printer
systemd-sysvcompat
tar
termite
testdisk
texinfo
tidy
toggldesktop-bin
tokei
tree
ttf-google-fonts-git
ttf-meslo
ttf-mplus
ttf-ms-win10
ttf-ms-win10-japanese
ttf-ms-win10-korean
ttf-ms-win10-other
ttf-ms-win10-sea
ttf-ms-win10-thai
ttf-ms-win10-zh_cn
ttf-ms-win10-zh_tw
ttf-twemoji-color
tuxboot
unzip
usbutils
util-linux
vagrant
vegeta
vi
virtualbox
virtualbox-ext-oracle
vte3
w3m
wdiff
wget
which
words-insane
wrk
xautolock
xclip
xdg-desktop-portal-kde
xf86-video-intel
xfsprogs
xonsh
xorg-xinit
xorg-xsetroot
xpdf
xprintidle
xsel
yarn
yay-bin
youtube-dl
yubikey-manager
yubikey-manager-qt
zathura
zip
zsh
```
