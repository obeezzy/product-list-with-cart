"""Deploy Flask app as a static site.
"""
from app import app
import shutil
import os

output_dir = "public"
source_static = "app/static"             # your Flask static folder
target_static = os.path.join(output_dir, "static")


def main():
    with app.test_client() as client:
        for rule in app.url_map.iter_rules():
            # ignore routes with parameters like /user/<id>
            if "<" in rule.rule:
                continue

            url = rule.rule
            print("Rendering:", url)

            response = client.get(url)
            html = response.data.decode("utf-8")

            # determine filename
            if url == "/":
                filename = "index.html"
            else:
                filename = url.strip("/") + ".html"

            output_path = os.path.join(output_dir, filename)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)

            print("Saved:", output_path)

        # Remove old static folder if it exists
        if os.path.exists(target_static):
            shutil.rmtree(target_static)

        shutil.copytree(source_static, target_static)
        print("Copied static files to:", target_static)


if __name__ == "__main__":
    main()
