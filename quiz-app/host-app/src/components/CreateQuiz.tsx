// ============================================================
// CreateQuiz - Formulaire de creation d'un quiz
// A IMPLEMENTER : construire le formulaire dynamique
// ============================================================

import { useState } from 'react'
import type { QuizQuestion } from '@shared/index'

interface CreateQuizProps {
  /** Callback appele quand le formulaire est soumis */
  onSubmit: (title: string, questions: QuizQuestion[]) => void
}

/** Une question en cours de creation (avant validation) */
interface DraftQuestion {
  id: string
  text: string
  choices: [string, string, string, string]
  correctIndex: number
  timerSec: number
}

/**
 * Composant formulaire pour creer un nouveau quiz.
 *
 * Ce qu'il faut implementer :
 * - Un champ pour le titre du quiz
 * - Une liste dynamique de questions (pouvoir en ajouter/supprimer)
 * - Pour chaque question :
 *   - Un champ texte pour la question
 *   - 4 champs texte pour les choix de reponse
 *   - Un selecteur (radio) pour la bonne reponse (correctIndex)
 *   - Un champ pour la duree du timer en secondes
 * - Un bouton pour ajouter une question
 * - Un bouton pour soumettre le formulaire
 *
 * Astuce : utilisez un state pour stocker un tableau de questions
 * et generez un id unique pour chaque question (ex: crypto.randomUUID())
 *
 * Classes CSS disponibles : .create-form, .form-group, .question-card,
 * .question-card-header, .choices-inputs, .choice-input-group,
 * .btn-add-question, .btn-remove, .btn-primary
 */
function CreateQuiz({ onSubmit }: CreateQuizProps) {
  // TODO: State pour le titre
  const [title, setTitle] = useState('')

  // TODO: State pour la liste des questions
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    {
      id: Math.random().toString(36).substring(2, 10),
      text: '',
      choices: ['', '', '', ''],
      correctIndex: 0,
      timerSec: 20,
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Valider que le titre n'est pas vide
    if (title.trim() === '') {
      alert('Le titre du quiz ne peut pas etre vide')
      return
    }

    // TODO: Valider qu'il y a au moins 1 question
    if (questions.length === 0) {
      alert('Ajoutez au moins une question')
      return
    }

    // TODO: Valider que chaque question a un texte et 4 choix non-vides
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (q.text.trim() === '') {
        alert(`La question ${i + 1} n'a pas de texte`)
        return
      }
      for (let j = 0; j < q.choices.length; j++) {
        if (q.choices[j].trim() === '') {
          alert(`La question ${i + 1} a un choix vide`)
          return
        }
      }
    }

    // TODO: Appeler onSubmit(title, questions)
    onSubmit(title, questions as QuizQuestion[])
  }

  const addQuestion = () => {
    const newQuestion: DraftQuestion = {
      id: Math.random().toString(36).substring(2, 10),
      text: '',
      choices: ['', '', '', ''],
      correctIndex: 0,
      timerSec: 20,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index)
    setQuestions(updated)
  }

  const updateQuestion = (index: number, field: keyof DraftQuestion, value: string | number) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateChoice = (qIndex: number, cIndex: number, value: string) => {
    const updated = [...questions]
    const newChoices = [...updated[qIndex].choices] as [string, string, string, string]
    newChoices[cIndex] = value
    updated[qIndex] = { ...updated[qIndex], choices: newChoices }
    setQuestions(updated)
  }

  return (
    <div className="phase-container">
      <h1>Creer un Quiz</h1>
      <form className="create-form" onSubmit={handleSubmit}>

        {/* TODO: Champ titre */}
        <div className="form-group">
          <label>Titre du quiz</label>
          <input
            type="text"
            placeholder="Ex: Quiz JavaScript"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* TODO: Liste des questions avec .question-card */}
        {questions.map((q, qIndex) => (
          <div key={q.id} className="question-card">
            <div className="question-card-header">
              <span>Question {qIndex + 1}</span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Texte de la question</label>
              <input
                type="text"
                placeholder="Ex: Quelle est la capitale de la France ?"
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
              />
            </div>

            <div className="choices-inputs">
              {q.choices.map((choice, cIndex) => (
                <div key={cIndex} className="choice-input-group">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctIndex === cIndex}
                    onChange={() => updateQuestion(qIndex, 'correctIndex', cIndex)}
                  />
                  <input
                    type="text"
                    placeholder={`Choix ${cIndex + 1}`}
                    value={choice}
                    onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Duree (secondes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={q.timerSec}
                onChange={(e) => updateQuestion(qIndex, 'timerSec', parseInt(e.target.value))}
              />
            </div>
          </div>
        ))}

        {/* TODO: Bouton ajouter une question */}
        <button type="button" className="btn-add-question" onClick={addQuestion}>
          + Ajouter une question
        </button>

        {/* TODO: Bouton soumettre */}
        <button type="submit" className="btn-primary">
          Creer le quiz
        </button>

      </form>
    </div>
  )
}

export default CreateQuiz
