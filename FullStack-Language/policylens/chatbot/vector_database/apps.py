from django.apps import AppConfig
import os
import glob
from django.conf import settings

class VectorDatabaseConfig(AppConfig):
    name = "chatbot.vector_database"

    def ready(self):
        # Only do this on the *actual* runserver child process, not the watcher:
        #   RUN_MAIN is set by the auto‐reloader in the child.
        if settings.DEBUG and os.environ.get("RUN_MAIN") != "true":
            return
        
        from .vector_store import ingest_pdf, persist_dir
        db_file = os.path.join(persist_dir, "chroma.sqlite3")

        # Check for the existence of data files in the collection subfolder
        collection_folders = glob.glob(os.path.join(persist_dir, "*-*-*-*-*"))
        data_files_exist = False

        if collection_folders:
            for folder in collection_folders:
                data_file = os.path.join(folder, "data_level0.bin")
                if os.path.exists(data_file):
                    data_files_exist = True
                    break

        # Only ingest if the persist directory is empty
        if not (os.path.exists(db_file) and data_files_exist):
            pdf_path = os.path.join(settings.BASE_DIR, "chatbot", "vector_database","website_content")
            # print(pdf_path)
            ingest_pdf(pdf_path)
