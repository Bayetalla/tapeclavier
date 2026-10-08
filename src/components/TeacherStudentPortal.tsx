import React, { useState } from 'react';
import { Users, GraduationCap, Plus, CheckCircle2, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  classCode: string;
  targetWpm: number;
  targetAccuracy: number;
  durationMinutes: number;
  deadline: string;
  text: string;
}

interface StudentSubmission {
  studentName: string;
  wpm: number;
  accuracy: number;
  status: 'passed' | 'failed' | 'pending';
  date: string;
}

interface TeacherStudentPortalProps {
  onStartAssignment: (text: string, title: string) => void;
}

export const TeacherStudentPortal: React.FC<TeacherStudentPortalProps> = ({
  onStartAssignment,
}) => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');

  // Teacher states
  const [classCode, setClassCode] = useState<string>('CLAVIER-2026');
  const [className, setClassName] = useState<string>('Classe BTS Informatique A');
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'asg-1',
      title: 'Devoir Semaine 1 : Ligne de repos et fluidité',
      classCode: 'CLAVIER-2026',
      targetWpm: 35,
      targetAccuracy: 95,
      durationMinutes: 10,
      deadline: '15 Octobre 2026',
      text: 'les dix doigts s\'alignent sur la ligne centrale pour une vitesse constante et souple',
    },
    {
      id: 'asg-2',
      title: 'Devoir Semaine 2 : Syntaxe de programmation et accolades',
      classCode: 'CLAVIER-2026',
      targetWpm: 40,
      targetAccuracy: 96,
      durationMinutes: 15,
      deadline: '22 Octobre 2026',
      text: 'const handleAction = () => { return { status: 200, valid: true }; };',
    },
  ]);

  const [students, setStudents] = useState<StudentSubmission[]>([
    { studentName: 'Lucas Martin', wpm: 48, accuracy: 98, status: 'passed', date: 'Hier' },
    { studentName: 'Emma Bernard', wpm: 42, accuracy: 96, status: 'passed', date: 'Aujourd\'hui' },
    { studentName: 'Thomas Petit', wpm: 31, accuracy: 89, status: 'failed', date: 'Il y a 2h' },
    { studentName: 'Chloé Dubois', wpm: 0, accuracy: 0, status: 'pending', date: '-' },
  ]);

  // Student join code state
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // New assignment modal
  const [isCreatingAssignment, setIsCreatingAssignment] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newWpm, setNewWpm] = useState<number>(40);
  const [newAcc, setNewAcc] = useState<number>(95);
  const [newText, setNewText] = useState<string>('Le travail assidu garantit la victoire dactylographique.');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      classCode,
      targetWpm: newWpm,
      targetAccuracy: newAcc,
      durationMinutes: 10,
      deadline: 'Fin de semaine',
      text: newText,
    };
    setAssignments([...assignments, newAsg]);
    setIsCreatingAssignment(false);
    setNewTitle('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header & Role Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            Espace Enseignant & Élèves
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Gestion de classes, devoirs dactylographiques et suivi des progrès en temps réel.
          </p>
        </div>

        {/* Role toggle */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setRole('teacher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              role === 'teacher' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Mode Enseignant
          </button>
          <button
            onClick={() => setRole('student')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              role === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mode Élève
          </button>
        </div>
      </div>

      {role === 'teacher' ? (
        /* Teacher Dashboard View */
        <div className="space-y-6">
          {/* Class info banner */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Classe active</span>
              <h3 className="text-lg font-bold text-white">{className}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Code classe à partager avec vos élèves :{' '}
                <strong className="text-indigo-400 font-mono tracking-wider text-sm bg-slate-800 px-2 py-0.5 rounded">
                  {classCode}
                </strong>
              </p>
            </div>
            <button
              onClick={() => setIsCreatingAssignment(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Créer un devoir
            </button>
          </div>

          {/* Assignments list */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-4">Devoirs Assignés</h4>
            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-sm font-semibold text-white">{asg.title}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Exigence : min {asg.targetWpm} WPM</span>
                      <span>·</span>
                      <span>Précision : min {asg.targetAccuracy}%</span>
                      <span>·</span>
                      <span>Échéance : {asg.deadline}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartAssignment(asg.text, asg.title)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    Tester ce devoir
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student roster submissions */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-4">Résultats des Élèves</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Élève</th>
                    <th className="pb-2 font-medium">Vitesse</th>
                    <th className="pb-2 font-medium">Précision</th>
                    <th className="pb-2 font-medium">Statut</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.map((st, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 text-white font-medium">{st.studentName}</td>
                      <td className="py-2.5 text-indigo-400 font-mono font-bold tabular-nums">
                        {st.wpm > 0 ? `${st.wpm} WPM` : '-'}
                      </td>
                      <td className="py-2.5 text-emerald-400 font-mono font-bold tabular-nums">
                        {st.accuracy > 0 ? `${st.accuracy}%` : '-'}
                      </td>
                      <td className="py-2.5">
                        {st.status === 'passed' ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                          </span>
                        ) : st.status === 'failed' ? (
                          <span className="text-rose-400 font-medium">Insuffisant</span>
                        ) : (
                          <span className="text-slate-500">Non rendu</span>
                        )}
                      </td>
                      <td className="py-2.5 text-slate-400">{st.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Student Portal View */
        <div className="space-y-6">
          {!isJoined ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white mb-2">Rejoindre une Classe</h3>
              <p className="text-xs text-slate-400 mb-6">
                Entrez votre nom et le code de classe fourni par votre enseignant.
              </p>
              <div className="space-y-3 text-left mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Votre Prénom et Nom</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ex: Sarah Connor"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Code de la classe</label>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                    placeholder="Ex: CLAVIER-2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm uppercase outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsJoined(true)}
                disabled={!studentName.trim() || !enteredCode.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Accéder à mes devoirs
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs text-slate-400">Élève : {studentName}</span>
                  <h3 className="text-lg font-bold text-white">Classe : {classCode}</h3>
                </div>
                <button
                  onClick={() => setIsJoined(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Changer de classe
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-4">Vos Devoirs à Compléter</h4>
              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="text-sm font-semibold text-white">{asg.title}</h5>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Objectif : {asg.targetWpm} WPM</span>
                        <span>·</span>
                        <span>Précision : {asg.targetAccuracy}%</span>
                        <span>·</span>
                        <span>Échéance : {asg.deadline}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onStartAssignment(asg.text, asg.title)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all shrink-0"
                    >
                      Démarrer le devoir
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal create assignment */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Créer un Nouveau Devoir</h4>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Titre du devoir</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Devoir 3 - Chiffres et ponctuation"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vitesse minimum (WPM)</label>
                  <input
                    type="number"
                    value={newWpm}
                    onChange={(e) => setNewWpm(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Précision minimum (%)</label>
                  <input
                    type="number"
                    value={newAcc}
                    onChange={(e) => setNewAcc(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Texte du devoir</label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingAssignment(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
                >
                  Enregistrer et assigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
