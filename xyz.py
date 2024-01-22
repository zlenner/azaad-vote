import json

# Function to convert text encoding
def convert_encoding(text):
    raw_bytes = text.encode("windows-1252")
    return raw_bytes.decode("utf-8")

# Path to the JSON file
file_path = './src/geojson/national.json'

# Read the JSON file
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Check if 'Symbol' field exists and convert its encoding
for item in data:
    if 'Symbol' in item:
        try:
            convert_encoding(item['Symbol'])
        except Exception:
            print(item["Symbol"])

# with open(file_path, 'w', encoding='utf-8') as file:
#     json.dump(data, file, ensure_ascii=False, indent=4)
