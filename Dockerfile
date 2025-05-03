FROM jekyll/jekyll
COPY Gemfile* ./
RUN gem install bundler jekyll
ENTRYPOINT [ "jekyll" ]

CMD [ "build" ]
#CMD bundle exec jekyll serve
# CMD [bundle, 'exec', 'jekyll', 'serve', '--host', '0.0.0.0', '-l']
# docker run -v $PWD:/srv -p 35729:35729 -p 4000:4000 -it jekyll/jekyll /bin/sh
# cd /srv
# bundle
# bundle exec jekyll serve --host 0.0.0.0 -l