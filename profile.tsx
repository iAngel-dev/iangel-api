import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [memoryInput, setMemoryInput] = useState("");
  const [fullMemory, setFullMemory] = useState<string[] | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("iangel_token") || "felix1234";
    fetch(`https://iangel-api.onrender.com/user/${token}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const playVoice = () => {
    const audio = new Audio(`/audios/voice_${profile.preferred_voice || "Sol"}.mp3`);
    audio.play();
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(`https://iangel-ai.com/share/${profile.token}`);
    alert("Lien de partage copié dans le presse-papier !");
  };

  const boostMemory = async () => {
    const token = profile.token;
    await fetch(`https://iangel-api.onrender.com/user/${token}/memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry: memoryInput })
    });
    alert("Souvenir ajouté à la mémoire !");
    setMemoryInput("");
  };

  const showFullMemory = async () => {
    const token = profile.token;
    const res = await fetch(`https://iangel-api.onrender.com/user/${token}/memory`);
    const data = await res.json();
    setFullMemory(data.memory);
  };

  const deleteMemory = async (index: number) => {
    const confirm = window.confirm("Souhaitez-vous vraiment supprimer ce souvenir ?");
    if (!confirm) return;
    const token = profile.token;
    await fetch(`https://iangel-api.onrender.com/user/${token}/memory/${index}`, { method: "DELETE" });
    showFullMemory();
  };

  const clearAllMemory = async () => {
    const confirm = window.confirm("Effacer toute votre mémoire iAngel ?");
    if (!confirm) return;
    const token = profile.token;
    await fetch(`https://iangel-api.onrender.com/user/${token}/memory`, { method: "DELETE" });
    setFullMemory([]);
  };

  const startEdit = (idx: number, value: string) => {
    setEditIndex(idx);
    setEditValue(value);
  };

  const saveEdit = async () => {
    const token = profile.token;
    await fetch(`https://iangel-api.onrender.com/user/${token}/memory/${editIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry: editValue })
    });
    setEditIndex(null);
    setEditValue("");
    showFullMemory();
  };

  if (loading) return <div className="p-4">Chargement du profil iAngel...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Mon Profil iAngel</h1>
        <p className="text-muted-foreground text-sm">Bienvenue, {profile.token}</p>
        <Button variant="outline" className="mt-2" onClick={playVoice}>Écouter ma voix préférée</Button>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div>
              <strong>Voix préférée :</strong> {profile.preferred_voice}
            </div>
            <div>
              <strong>Créé le :</strong> {new Date(profile.created_at).toLocaleString()}
            </div>
            <div>
              <strong>Interactions enregistrées :</strong> {profile.interactions?.length || 0}
            </div>
            <div>
              <strong>Mémoire :</strong>
              <ul className="list-disc list-inside text-sm">
                {profile.memory?.slice(-3).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                )) || <li>Aucun souvenir pour le moment</li>}
              </ul>
            </div>
            <Input
              placeholder="Ajoutez un souvenir ici..."
              value={memoryInput}
              onChange={(e) => setMemoryInput(e.target.value)}
            />
            <Button className="mt-2 w-full" onClick={boostMemory}>📌 Enregistrer ce souvenir</Button>
            <Button className="mt-2 w-full" onClick={showFullMemory}>🧠 Voir toute la mémoire</Button>
            <Button className="mt-2 w-full" onClick={shareProfile}>Partager mon iAngel</Button>
            {fullMemory && (
              <div className="mt-4 bg-white rounded-lg p-3 border shadow-sm text-sm">
                <h2 className="font-semibold mb-2">Mémoire complète :</h2>
                <ul className="list-disc list-inside space-y-1">
                  {fullMemory.map((item, idx) => (
                    <li key={idx} className="flex flex-col gap-1">
                      {editIndex === idx ? (
                        <div className="flex items-center gap-2">
                          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                          <Button size="sm" onClick={saveEdit}>💾</Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>{item}</span>
                          <div className="space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => startEdit(idx, item)}>✏️</Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteMemory(idx)}>❌</Button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <Button variant="destructive" className="mt-2 w-full" onClick={clearAllMemory}>🧹 Effacer toute la mémoire</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
