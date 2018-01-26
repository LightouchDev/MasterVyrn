@ECHO OFF

TITLE GBF proxy dump server (for web)

SET targetFolder=C:\Users\Miau\Documents\Git\GBF_GAME
SET listenPort=55688
SET DEBUG=dump:*
SET applyPrettier=true

node index.js
pause