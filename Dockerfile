FROM ruby:3.4.7-trixie

WORKDIR /site

ENTRYPOINT ["bundle", "exec", "jekyll"]

ENV LANG C.UTF-8

ARG USERNAME=austinpray
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# install stuff
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
       vim \
       zsh \
       just \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
 && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME --shell /usr/bin/zsh

USER $USERNAME

COPY Gemfile Gemfile.lock ./

RUN bundle install --frozen
