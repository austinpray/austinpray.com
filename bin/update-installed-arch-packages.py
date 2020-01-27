#!/usr/bin/env python

import subprocess, re, datetime

post = open("./_posts/2016-09-26-arch-linux-notes.md", "r+")

ps = subprocess.Popen(('pacman', '-Qe'), stdout=subprocess.PIPE)
output = subprocess.check_output(('cut', '-f1', '-d', ' '), stdin=ps.stdout).decode('UTF-8')
ps.wait()

new_text = re.sub(r"```arch-packages\n(?:[\S\s]*?)```", "```arch-packages\n%s```" % output, post.read(), re.M)
date_string = datetime.date.today().strftime("%Y-%m-%d")
new_text = re.sub(r'Packages list last updated:(.*?)\n', "Packages list last updated: %s\n" % date_string, new_text, re.M)

post.seek(0)
post.truncate()
post.write(new_text)
post.close()

print(new_text)
