from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)
PROFILE_DIR = "user_profiles"

def get_profile_path(token):
    return os.path.join(PROFILE_DIR, f"{token}.json")

@app.route("/user/<token>/memory", methods=["GET"])
def get_memory(token):
    filepath = get_profile_path(token)
    if not os.path.exists(filepath):
        return jsonify({"error": "User profile not found"}), 404
    with open(filepath, "r", encoding="utf-8") as f:
        profile = json.load(f)
        memory = profile.get("memory", [])
    return jsonify({"memory": memory}), 200

@app.route("/user/<token>/memory", methods=["POST"])
def save_memory(token):
    data = request.get_json()
    entry = data.get("entry", "").strip()
    if not entry:
        return jsonify({"error": "No memory entry provided"}), 400
    filepath = get_profile_path(token)
    if not os.path.exists(filepath):
        return jsonify({"error": "User profile not found"}), 404
    with open(filepath, "r+", encoding="utf-8") as f:
        profile = json.load(f)
        profile.setdefault("memory", []).append(entry)
        f.seek(0)
        f.truncate()
        json.dump(profile, f, indent=4)
    return jsonify({"message": "Memory saved", "entry": entry}), 200

@app.route("/user/<token>/memory/<int:index>", methods=["DELETE"])
def delete_memory_entry(token, index):
    filepath = get_profile_path(token)
    if not os.path.exists(filepath):
        return jsonify({"error": "User profile not found"}), 404
    with open(filepath, "r+", encoding="utf-8") as f:
        profile = json.load(f)
        memory = profile.get("memory", [])
        if 0 <= index < len(memory):
            removed = memory.pop(index)
            profile["memory"] = memory
            f.seek(0)
            f.truncate()
            json.dump(profile, f, indent=4)
            return jsonify({"message": "Memory deleted", "removed": removed}), 200
        else:
            return jsonify({"error": "Invalid memory index"}), 400

@app.route("/user/<token>/memory", methods=["DELETE"])
def clear_memory(token):
    filepath = get_profile_path(token)
    if not os.path.exists(filepath):
        return jsonify({"error": "User profile not found"}), 404
    with open(filepath, "r+", encoding="utf-8") as f:
        profile = json.load(f)
        profile["memory"] = []
        f.seek(0)
        f.truncate()
        json.dump(profile, f, indent=4)
    return jsonify({"message": "All memory cleared"}), 200

@app.route("/user/<token>/memory/<int:index>", methods=["PUT"])
def update_memory_entry(token, index):
    data = request.get_json()
    new_entry = data.get("entry", "").strip()
    if not new_entry:
        return jsonify({"error": "No new entry provided"}), 400
    filepath = get_profile_path(token)
    if not os.path.exists(filepath):
        return jsonify({"error": "User profile not found"}), 404
    with open(filepath, "r+", encoding="utf-8") as f:
        profile = json.load(f)
        memory = profile.get("memory", [])
        if 0 <= index < len(memory):
            memory[index] = new_entry
            profile["memory"] = memory
            f.seek(0)
            f.truncate()
            json.dump(profile, f, indent=4)
            return jsonify({"message": "Memory updated", "entry": new_entry}), 200
        else:
            return jsonify({"error": "Invalid memory index"}), 400
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
