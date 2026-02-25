import logging
from logging.handlers import RotatingFileHandler
import json

class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname,
            "time": self.formatTime(record, "%Y-%m-%d %H:%M:%S"),
            "message": record.getMessage(),
            "module": record.module,
            "funcName": record.funcName,
            "line_no": record.lineno
        }
        if hasattr(record, "extra"):
            log_record.update(record.extra)
        return json.dumps(log_record)

# File handler
file_handler = RotatingFileHandler("backend.log", maxBytes=5*1024*1024, backupCount=3)
file_handler.setFormatter(JsonFormatter())

# Logger
logger = logging.getLogger("resume_saas")
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(JsonFormatter())
logger.addHandler(console_handler)