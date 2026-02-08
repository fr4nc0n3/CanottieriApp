#!/bin/bash
/usr/bin/google-chrome-stable \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  "$1"