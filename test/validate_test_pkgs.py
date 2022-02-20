"""
v0.0.1
@title validate package schema
"""
import json
import jsonschema


def load_package_schema():
    with open("src/schema.json") as schema_file:
        schema = json.load(schema_file)
    return schema


FILES_TO_VALIDATE = (
    "./test/draft.json",
)


def validate_test_packages():
    package_schema = load_package_schema()
    for file_path in FILES_TO_VALIDATE:
        with open(file_path) as package_file:
            try:
                package = json.load(package_file)
            except json.JSONDecodeError as error:
                raise ValueError(
                    "Invalid XSEF File: {0}\n{1}".format(file_path, str(error))
                )
            except Exception as error:
                raise ValueError("?Error: {0}\n{1}".format(file_path, str(error)))
            jsonschema.validate(package, package_schema)


if __name__ == "__main__":
    validate_test_packages()