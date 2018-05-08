import path from 'path';
import log from 'electron-log';
import { app } from 'electron';

log.transports.file.level = 'info';
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] {text}';
log.transports.file.maxSize = 500 * 1024 * 1024;
log.transports.file.file = path.join(app.getPath('userData'), 'app.log');

export default log;
