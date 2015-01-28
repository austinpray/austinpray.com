---
layout: post 
title: "Build Steps and Deployment" 
date: 2015-01-15
categories: ops
tags: gulp 
---

_Based on the discussion over here:
[roots/roots/pull/1257](https://github.com/roots/roots/pull/1257#issuecomment-70195437)._

These days your web project probably has a build step. Your build step takes
your styles, scripts, and other assets and packages them for the browser. Maybe
you are using [gulp][], [grunt][], or even [make][] to orchestrate all your
compilation steps. This post covers a couple methods for deploying projects with
compiled assets and each method's respective gotchas.

## General Rules of Thumb

- __Never commit compiled files to source control.__ Believe it or not, *source*
    control is for *source* files. 
    1. Compiled files in a repo make it difficult to use the merge and rebase
    features in git.
    2. Compiled files muddy the history and increase the size of the repo.
    3. It just doesn't make sense to put "binaries" in your *source* control.
- __Deployments are completely automated and driven by your version control
    repository.__ Whether you are using something like
    [Capistrano](http://capistranorb.com/), a [hand-rolled git deploy
    process](http://blog.codeclimate.com/blog/2013/10/02/high-speed-rails-deploys-with-git/)
    or a [PaaS that gives you git deploy
    options](https://devcenter.heroku.com/articles/git): you should have [one
    codebase tracked in revision control and many
    deploys](http://12factor.net/codebase).
- __Ideally Dev matches Production exactly.__ You should have a reproducible,
    portable development environment which exactly matches the environment your
    production app runs in. The most conventional way to do this is to use
    [Vagrant](https://www.vagrantup.com/). The new hotness is
    [Docker](https://www.docker.com/).

## Deployment Patterns

So at this point [your source control drives your many deploys][12fcb]. Your
build process outputs compiled files optimized for the browser. You are banned
from checking any of these compiled files into source control. So how do the
compiled files get to the proper place on the application server? It really
depends on who or what is going to be running the build.

### 1. Locally Compile and Upload Assets

As a part of your deployment process on your local development machine:

- Build the project
- Copy compiled files to the remote destination

#### Where this falls apart:

- __No single source of truth:__ When you have multiple people deploying and
  compiling there is a lack of "single source of truth". This becomes a problem
  when working on a team or when you hand off a project. You run the risk of
  differences in a particular developer's setup causing differences in the
  compiled output. Although this doesn't happen often if you are diligent about
  locking down dependency versions: when it does it is extremely frustrating and
  expensive. It amounts to a ping-pong of intermittent issues based on who is
  actually deploying.
- __Everyone Requires Credentials:__ Anyone who needs to deploy has to have
  access credentials for the server. This requires discipline and lots of work
  to keep credentials from floating around in the wild.
- __Uploading is slow:__ uploading a bunch of files, especially over SCP, is
    generally pretty slow.
- __Requires Discipline:__ You cannot run a deploy while there are uncommitted
    changes in your local source assets, intentional or not. You will have to
    stash any changes before deploying. In addition, you have to be on the exact
    branch your target stage relies on. Otherwise, the assets you upload will not
    match the application files in git. For instance: 
    1. You are trying to deploy to "Staging" which pulls code from the "Develop"
       branch.
    2. You unknowingly find yourself with the master branch checked out while
       running the deploy.
    3. The deploy process will pull the latest code from the "Develop" branch.
    4. Your local machine will upload the compiled assets from the master
       branch. 
    5. Uh oh! Now, among other things, your templates don't match your
       JavaScript or your styles! You done goofed everything.

#### Recommendation:

If you are a lone developer with no project handoff in sight, there is probably
nothing wrong with this pattern. It is crude but easy to setup. Also, if you do
not have the ability to install dependencies on the remote box you might be
forced to use this pattern.

### 2. Compile on the Application Server

As a part of your initial server provisioning process:

- Install build dependencies and runtimes. If, for instance, you are using gulp
  to build your project's assets you would install Node.js and npm.

As a part of your deployment process trigger on the remote application server:

- Update, prune, rebuild project build dependencies.
  [\(example\)](https://github.com/heroku/heroku-buildpack-nodejs/blob/e227568521c15875d9dd003a2562e885dcff0946/lib/build.sh#L166)
- Trigger the build 

The application server becomes the single source of truth.

#### Where this falls apart:

- __Everyone Requires Credentials__
- __Additional Dependencies Required on Application Server:__ most people prefer
  to keep their application servers as lean as possible. Having your
  application server "know" about the build process and its dependencies goes
  against this principle. Additional dependencies means additional provisioning
  time as well.
- __Not Suitable for Resource Intensive Build Processes:__ If you have a super
  duper large build process this can steal resources from app for the duration
  of the build process. In all likelihood, your development machine is a quad
  core machine with 16GB of memory. Your application servers are probably single
  core nodes with 1GB of memory or less. A minute long build process on your
  dev machine could take 10 minutes on your lean application server.

#### Recommendation:

Generally for web projects this is a safe bet. The setup is cheap and simple.
Due to the nature of web assets having to be consumed by a browser: building
them is usually not a big deal. In my experience, the benefit of reproducible
builds for team environments (especially remote teams) for little to no setup
cost is greater than any hemming and hawing about additional dependencies being
installed on the server.

### 3. Continuous Integration

Use something like [Jenkins](http://jenkins-ci.org) or a hosted solution like
[Travis](https://travis-ci.org). Your CI server watches your repo for new
commits. When a commit happens the CI server:

- Runs any pre-deploy checks (tests, linters, etc.)
- Runs deploy
- compiles and uploads assets

So:

- Continuous integration server becomes the single source of truth
- Developers only need access to the source code to be able to contribute to a
  project. The CI server has all the privileged access under lock and key.
- Application server is as lean as possible, reduce server provisioning time.
- Discipline is enforced by CI server so when building human error is not a
  thing. You can make sure tests must pass and style guides must be followed
  before code makes it to production.

#### Where this falls apart:

This doesn't fall apart unless your CI server falls apart. However, the upfront
cost is significant. A CI server is definitely only worth it in the case of:

- Team environment
- Long-lived project or lots of projects/modules to subsidize the upfront cost
- Continuous development

#### Recommendation:

This is probably the most ideal deployment setup, but it is definitely only
worth the effort in certain cases. Continuous integration requires continuous
development. If you are working on a long-lived product in a team environment CI
is pretty much required. I can't imagine doing it any other way. For open source
projects: [Travis is free](https://travis-ci.org/plans) and it is awesome. Run
your tests, linting or style guide against any and all contributions.
Automatically build and update your docs. 

## Conclusion

There are lots of ways to skin this cat. The right solution depends heavily on
the context of the project. The good news is: if you are doing _something_
resembling any of the above you are probably on the right track.

How do you run your builds?

[gulp]: http://gulpjs.com/
[grunt]: http://gruntjs.com/
[make]: https://www.gnu.org/software/make/
[12fcb]: http://12factor.net/codebase
