---
layout: til_single
title: "TIL About Git Alias"
date: 2026-05-17
category: Development
published: true
read_time: 2
---

I work Git a lot. About ~30% of the times, I stare at a branch name before pushing and start re-thinking why I created a branch with such a descriptive name. The other 70% of the times, I make a typo and Git complains it does not have any idea what branch I'm talking about. Exaggerating, ofcourse. 😅

That, is when I came across [**git alias**](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) from the video [**So You Think You know Git**](https://www.youtube.com/watch?v=aolI_Rz0ZqY) presented by **Scott Chacon**

You can configure alias to shorten your git commands by adding a `[alias]` section to your `~/.gitconfig` file. You can also use `git config --global alias.<name> <command>` to configure aliases.

These are my aliases:

```
[alias]
    co = checkout                                              # checkout
    cob = checkout -b                                          # checkout branch
    st = status                                                # status
    pu = !git push origin `git branch --show-current`          # push current branch
    plu = !git pull origin `git branch --show-current`         # pull current branch
    ll = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat # log commit-ref, branch, commit-msg, author-name and files changed (numstat)
```

Thanks to this, I just have to `git pu` to push the current branch and `git plu` to pull from the current branch!
