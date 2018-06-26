FROM ruby

WORKDIR /site

ENTRYPOINT ["bundle", "exec", "jekyll"]

ENV LANG C.UTF-8

COPY Gemfile Gemfile.lock ./

RUN bundle install
