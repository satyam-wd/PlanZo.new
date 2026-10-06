import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Download,
  ExternalLink,
  FolderOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Plus,
  Search,
  BookMarked,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { SubjectCourse, FolderItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  getSubjectNotesDetail,
  OFFICIAL_FIRST_YEAR_DRIVE_LINK,
  FirstYearSubjectNotesDetail,
  UnitDetailedNote,
} from '../data/firstYearDetailedNotes';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

interface SubjectNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: SubjectCourse | null;
}

export const SubjectNotesModal: React.FC<SubjectNotesModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  const { subjectFolders, addCustomNoteToFolder, awardXp } = useApp();

  const [activeTab, setActiveTab] = useState<
    'units' | 'drive' | 'formulas' | 'pyq' | 'viva' | 'myNotes'
  >('units');
  const [selectedUnitNum, setSelectedUnitNum] = useState<number>(1);
  const [expandedConceptIdx, setExpandedConceptIdx] = useState<number | null>(0);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // New Note State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPages, setCustomPages] = useState('5 Pages · Handwritten');
  const [customSummary, setCustomSummary] = useState('');
  const [customTags, setCustomTags] = useState('Unit 1, Key Notes');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !subject) return null;

  const notesDetail: FirstYearSubjectNotesDetail = getSubjectNotesDetail(
    subject.id,
    subject.code,
    subject.name
  );

  const activeUnit: UnitDetailedNote =
    notesDetail.units.find((u) => u.unitNumber === selectedUnitNum) ||
    notesDetail.units[0];

  const currentFolder = subjectFolders[subject.id] || {
    subjectId: subject.id,
    topperNotes: [],
    previousYearQuestions: [],
    labVivaQuestions: [],
    assignments: [],
  };

  const handleCopyFormula = (formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(formulaText);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleCopyDriveLink = () => {
    navigator.clipboard.writeText(OFFICIAL_FIRST_YEAR_DRIVE_LINK);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newNote: FolderItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      type: 'notes',
      dateAdded: 'Added by Student',
      fileSizeOrPages: customPages,
      summary:
        customSummary.trim() ||
        `Handwritten study notes for ${subject.name}. Saved in vault.`,
      tags: customTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    addCustomNoteToFolder(subject.id, newNote);
    awardXp(30, `Added Notes for ${subject.name}`);
    playTaskCompleteSound();
    fireConfetti();

    setCustomTitle('');
    setCustomSummary('');
    setIsAddingNote(false);
    setActiveTab('myNotes');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-stone-900 dark:text-stone-100">
        {/* 1. Header with Title: "Notes of {subject.name}" */}
        <div className="px-5 sm:px-7 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-start justify-between gap-4 bg-gradient-to-r from-teal-50/60 via-white to-indigo-50/40 dark:from-teal-950/20 dark:via-stone-900 dark:to-indigo-950/20">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-teal-600 text-white shadow-xs">
                {subject.code}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {subject.credits} Credits · 5 Units
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>1st Year Foundation Notes</span>
              </span>
            </div>

            <h2
              id="modal-title"
              className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2"
            >
              <span>Notes of {subject.name}</span>
            </h2>

            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
              Standard Textbook: {notesDetail.textbook}
            </p>
          </div>

          {/* Top Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Drive Link Button */}
            <a
              href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs"
              title="Open Official Google Drive Folder with Complete PDFs"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Drive Notes Folder</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Drive Banner Callout */}
        <div className="px-5 sm:px-7 py-2.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 border-b border-teal-200/60 dark:border-teal-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              All handwritten notes, unit Xeroxes, and question papers for this subject are synced with the official Google Drive repository.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyDriveLink}
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Drive Link</span>
                </>
              )}
            </button>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <a
              href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1"
            >
              <span>Open Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-7 border-b border-stone-200/80 dark:border-stone-800 overflow-x-auto scrollbar-none bg-stone-50/50 dark:bg-stone-850/50 text-xs">
          <button
            onClick={() => setActiveTab('units')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'units'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Unit-Wise Detailed Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'drive'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Drive PDFs & Handwritten Xerox</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'formulas'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Formula Cheatsheet</span>
          </button>

          <button
            onClick={() => setActiveTab('pyq')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pyq'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Solved University PYQs</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'viva'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Lab Viva Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('myNotes')}
            className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'myNotes'
                ? 'border-teal-600 text-teal-700 dark:text-teal-300'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>My Saved Notes ({currentFolder.topperNotes.length})</span>
          </button>
        </div>

        {/* 3. Main Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* TAB 1: UNIT-WISE DETAILED NOTES */}
          {activeTab === 'units' && (
            <div className="space-y-6">
              {/* Unit Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {notesDetail.units.map((u) => {
                  const isSelected = u.unitNumber === selectedUnitNum;
                  return (
                    <button
                      key={u.unitNumber}
                      onClick={() => {
                        setSelectedUnitNum(u.unitNumber);
                        setExpandedConceptIdx(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span>Unit {u.unitNumber}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-teal-700 text-teal-100'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {u.weightage}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Unit Header Card */}
              <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                    Syllabus Module {activeUnit.unitNumber}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    Estimated Exam Marks: ~14 Marks
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  {activeUnit.unitTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {activeUnit.summary}
                </p>
              </div>

              {/* Key Formulas Section */}
              {activeUnit.keyFormulas && activeUnit.keyFormulas.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Essential Formulas & Mathematical Laws for Unit {activeUnit.unitNumber}</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeUnit.keyFormulas.map((formula, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3.5 rounded-xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 flex items-start justify-between gap-3 group"
                      >
                        <div className="space-y-1">
                          <div className="font-mono text-xs font-bold text-teal-900 dark:text-teal-200">
                            {formula}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopyFormula(formula)}
                          className="p-1.5 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors shrink-0"
                          title="Copy formula"
                        >
                          {copiedFormula === formula ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deep Concepts Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  <span>Core Syllabus Concepts & In-Depth Notes</span>
                </h4>

                <div className="space-y-3">
                  {activeUnit.keyConcepts.map((concept, cIdx) => {
                    const isExpanded = expandedConceptIdx === cIdx;
                    return (
                      <div
                        key={cIdx}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs"
                      >
                        <button
                          onClick={() =>
                            setExpandedConceptIdx(isExpanded ? null : cIdx)
                          }
                          className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-stone-50/60 dark:hover:bg-stone-850/50 transition-colors"
                        >
                          <span className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-[11px] font-bold flex items-center justify-center">
                              {cIdx + 1}
                            </span>
                            <span>{concept.heading}</span>
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-stone-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-400" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300 animate-in fade-in duration-150">
                            <p>{concept.description}</p>

                            {concept.bulletPoints && concept.bulletPoints.length > 0 && (
                              <ul className="space-y-1.5 pl-4 list-disc marker:text-teal-600">
                                {concept.bulletPoints.map((bp, bpIdx) => (
                                  <li key={bpIdx}>{bp}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High-Yield University Exam Questions */}
              {activeUnit.frequentExamQuestions && activeUnit.frequentExamQuestions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Frequently Asked University Exam Questions (With Model Solutions)</span>
                  </h4>

                  <div className="space-y-3">
                    {activeUnit.frequentExamQuestions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/40 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                            Q{qIdx + 1}. {q.question}
                          </p>
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                            {q.marks} Marks
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          <span className="font-semibold text-teal-700 dark:text-teal-400">
                            Answer Framework:{' '}
                          </span>
                          {q.answerSummary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DRIVE PDFS & TOPPER XEROX */}
          {activeTab === 'drive' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-950 dark:text-teal-200 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-teal-600" />
                    <span>Official Google Drive Repository for 1st Year</span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Direct access to original PDF scans, handwritten topper copies, and lecture slide decks for {subject.name}.
                  </p>
                </div>
                <a
                  href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Open Complete Drive Folder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* List of Topper Drive Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Available PDFs & Notes in Google Drive
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Master Note */}
                  <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                          {notesDetail.totalPdfPages}
                        </span>
                        <span>Google Drive Link</span>
                      </div>
                      <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {notesDetail.subjectName} Complete Handwritten Topper Notes (All 5 Units)
                      </h5>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Comprehensive handwritten lecture notes covering all modules, formulas, solved problems, and previous years end-sem exam papers.
                      </p>
                    </div>

                    <a
                      href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Open Drive File</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>

                  {/* Unit-wise Notes */}
                  {notesDetail.units.map((u) => (
                    <div
                      key={u.unitNumber}
                      className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-stone-400">
                          <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                            Unit {u.unitNumber} · 25-30 Pages
                          </span>
                          <span>PDF Document</span>
                        </div>
                        <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {u.unitTitle}
                        </h5>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                          {u.summary}
                        </p>
                      </div>

                      <a
                        href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>View Unit {u.unitNumber} on Drive</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORMULA CHEATSHEET */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Rapid Recall Formula Sheet & Governing Equations
                </h4>
                <span className="text-xs text-stone-400 font-mono">
                  {notesDetail.quickFormulas.length} Core Formulas
                </span>
              </div>

              <div className="space-y-3">
                {notesDetail.quickFormulas.map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {f.title}
                      </span>
                      <button
                        onClick={() => handleCopyFormula(f.formula)}
                        className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                      >
                        {copiedFormula === f.formula ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Formula</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 font-mono text-xs sm:text-sm font-bold text-teal-900 dark:text-teal-300 border border-stone-200/60 dark:border-stone-800 overflow-x-auto">
                      {f.formula}
                    </div>

                    <p className="text-xs text-stone-500 leading-relaxed">
                      💡 {f.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOLVED UNIVERSITY PYQS */}
          {activeTab === 'pyq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Previous Year Solved University Question Papers
                </h4>
                <a
                  href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>More on Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-3">
                <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Full Paper Solved
                    </span>
                    <span>Dec 2024 End-Semester</span>
                  </div>
                  <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    University End-Semester Exam 2024: {subject.code} Paper (Step-by-Step Solutions)
                  </h5>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Includes all 5 units 7-mark and 14-mark numerical calculations, derivation sketches, and marking scheme rubrics.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Solved Paper PDF</span>
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                      Curated by University Faculty
                    </span>
                    <span>High-Yield Recurring Bank</span>
                  </div>
                  <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Top 20 Repeated Questions (Last 5 Years 2019-2024)
                  </h5>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Guaranteed high frequency questions categorized by syllabus units with model diagram sketches and key scoring points.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-teal-700 dark:text-teal-300 transition-all flex items-center gap-1.5"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>View Question Bank on Drive</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LAB VIVA Q&A */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Guaranteed Viva Voce & Practical Exam Questions
              </h4>

              <div className="space-y-3">
                {currentFolder.labVivaQuestions && currentFolder.labVivaQuestions.length > 0 ? (
                  currentFolder.labVivaQuestions.map((viva, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                          {viva.importance}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">Q{vIdx + 1}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {viva.question}
                      </p>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border border-stone-200/60 dark:border-stone-800">
                        <span className="font-semibold text-teal-700 dark:text-teal-400">Answer: </span>
                        {viva.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-stone-400 text-xs">
                    No viva questions recorded for this subject yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MY SAVED NOTES & CUSTOM UPLOADS */}
          {activeTab === 'myNotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Saved Student Study Notes & Vault
                  </h4>
                  <p className="text-xs text-stone-500">
                    Personal handwritten summaries, lecture takeaways, and exam revisions.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add My Note</span>
                </button>
              </div>

              {/* Add Note Inline Form */}
              {isAddingNote && (
                <form
                  onSubmit={handleSaveCustomNote}
                  className="p-5 rounded-2xl border-2 border-teal-500/50 bg-teal-50/20 dark:bg-teal-950/20 space-y-3 animate-in fade-in"
                >
                  <h5 className="text-xs font-bold text-teal-900 dark:text-teal-200">
                    Save New Study Note for {subject.name}
                  </h5>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Note Title (e.g. Unit 3 Derivation Summary & Quick Formulas)"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Page Count / Format (e.g. 8 Pages · Handwritten)"
                        value={customPages}
                        onChange={(e) => setCustomPages(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100"
                      />
                      <input
                        type="text"
                        placeholder="Tags comma separated (e.g. Unit 3, Derivation, Formulas)"
                        value={customTags}
                        onChange={(e) => setCustomTags(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <textarea
                      placeholder="Detailed Summary or Handwritten Key Takeaways..."
                      value={customSummary}
                      onChange={(e) => setCustomSummary(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
                    >
                      Save to Vault (+30 XP)
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentFolder.topperNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                          {note.fileSizeOrPages || 'Study Note'}
                        </span>
                        <span>{note.dateAdded}</span>
                      </div>
                      <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {note.title}
                      </h5>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {note.summary}
                      </p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {note.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <a
                      href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>View in Google Drive</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>
              Curriculum for <strong className="text-stone-700 dark:text-stone-300">{subject.name}</strong> ({subject.code})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={OFFICIAL_FIRST_YEAR_DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-50 dark:hover:bg-stone-750 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
              <span>Google Drive Link</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
