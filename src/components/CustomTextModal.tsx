import React, { useState } from 'react';
import { Camera, FileText, Globe, Loader2, Sparkles, Upload, X } from 'lucide-react';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectText: (text: string, title: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onSelectText,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'image' | 'search'>('paste');
  const [customTitle, setCustomTitle] = useState<string>('Mon texte personnalisé');
  const [pastedText, setPastedText] = useState<string>('');

  // Search Grounding state
  const [searchTopic, setSearchTopic] = useState<string>('intelligence artificielle et avenir');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchSources, setSearchSources] = useState<{ title: string; url: string }[]>([]);

  // Image OCR state
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle image upload & analyze with Gemini 3.1 Pro Preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setIsAnalyzingImage(true);

      try {
        const response = await fetch('/api/gemini/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        const data = await response.json();
        if (response.ok && data.text) {
          setPastedText(data.text);
          setCustomTitle(`Transcription: ${file.name.replace(/\.[^/.]+$/, '')}`);
          setActiveTab('paste');
        } else {
          setErrorMessage(data.error || 'Impossible de transcrire l\'image.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Erreur lors de l\'analyse de l\'image.');
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Google Search news fetching with Gemini 3.5 Flash
  const handleFetchNews = async () => {
    if (!searchTopic) return;
    setIsSearching(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/search-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchTopic, language: 'fr' }),
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setPastedText(data.text);
        setCustomTitle(`Actualité : ${searchTopic}`);
        setSearchSources(data.sources || []);
        setActiveTab('paste');
      } else {
        setErrorMessage(data.error || 'Erreur lors de la recherche.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la recherche d\'actualités.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartTyping = () => {
    if (!pastedText.trim()) return;
    onSelectText(pastedText.trim(), customTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          Textes Personnalisés & IA
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Collez vos cours, scannez une photo de document ou générez un texte d'actualité en direct.
        </p>

        {/* Tab switchers */}
        <div className="flex gap-2 p-1 bg-slate-800/80 rounded-xl mb-6 border border-slate-700/60">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'paste' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Coller du texte
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'image' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Scanner une image (Gemini 3.1 Pro)
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Actualités Google Search
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Paste text */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Titre de l'exercice</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Contenu à taper</label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Collez ici votre paragraphe, article, code ou discours..."
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500">{pastedText.length} caractères</span>
            </div>
          </div>
        )}

        {/* Tab 2: Scan Image */}
        {activeTab === 'image' && (
          <div className="space-y-4 text-center">
            <div className="p-8 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl bg-slate-800/40 transition-colors flex flex-col items-center justify-center">
              <Upload className="w-10 h-10 text-indigo-400 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">
                Importez une photo de document, note de cours ou livre
              </p>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">
                Gemini 3.1 Pro Preview analysera l'image pour en extraire un texte dactylographique parfait.
              </p>

              <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                Sélectionner une photo
              </label>
            </div>

            {isAnalyzingImage && (
              <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse et transcription par Gemini 3.1 Pro en cours...
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Google Search Grounding */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Sujet d'actualité recherché (Google Search)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  placeholder="Ex: exploration spatiale, intelligence artificielle, climat..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleFetchNews}
                  disabled={isSearching}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shrink-0"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Générer
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Gemini 3.5 Flash effectue une recherche en temps réel et synthétise un texte d'entraînement frais et d'actualité.
            </p>
          </div>
        )}

        {/* Modal footer */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleStartTyping}
            disabled={!pastedText.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Lancer l'entraînement
          </button>
        </div>
      </div>
    </div>
  );
};
