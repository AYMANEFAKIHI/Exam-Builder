# 🚀 Quick Start - Phase 3 : Scoring & LaTeX

## ⚡ Démarrage Rapide

### 1. Installer les dépendances
```bash
npm run install-all
```

### 2. Démarrer l'application
```bash
npm run dev
```

### 3. Accéder à l'application
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000

---

## 🆕 Nouvelles Fonctionnalités

### 📊 Scoring Automatique
**Où ?** En bas à droite de l'écran lors de la création d'un examen

**Que fait-il ?**
- Calcule automatiquement le total de points
- Affiche le nombre d'exercices
- Montre la répartition par type de question
- Met à jour en temps réel

**Comment l'utiliser ?**
1. Créez des composants (Text, QCM, etc.)
2. Ajoutez des points à chaque composant
3. Le résumé s'affiche automatiquement
4. Le total se calcule en temps réel ✨

---

### 🧮 Support LaTeX

**Où ?** Dans les composants Text Field, QCM, Vrai/Faux, Texte à trous

**Syntaxe :**
- Inline : `$x^2 + y^2 = z^2$`
- Display : `$$\int_0^1 x^2 dx = \frac{1}{3}$$`

**Comment l'utiliser ?**

#### Text Field
```
1. Créez un bloc Text Field
2. Cochez "Enable LaTeX"
3. Tapez : Résoudre $x^2 - 5x + 6 = 0$
4. Voir la prévisualisation ✨
```

#### QCM
```
1. Créez un QCM
2. Cochez "Enable LaTeX in question"
3. Question : Quelle est la dérivée de $x^3$ ?
4. Options : 
   - Cochez "LaTeX" pour chaque option
   - A) $3x^2$
   - B) $x^2$
5. Prévisualisation automatique ✨
```

---

## 📝 Exemples Rapides

### Examen de Math
```
Exercice 1 : Algèbre (5 pts)
─────────────────────────────
Résoudre l'équation : $x^2 - 5x + 6 = 0$

QCM : La dérivée de $x^3$ est :
A) $3x^2$ ✓
B) $x^2$
C) $3x$
(3 pts)

Total : 8 pts ✨
```

### Examen de Physique
```
Exercice 1 : Cinématique (8 pts)
─────────────────────────────────
La vitesse est : $$v = v_0 + at$$

Calculer $v(3)$ si $v_0 = 5 m/s$ et $a = 2 m/s^2$
(5 pts)

Total : 13 pts ✨
```

### Examen de Chimie
```
Exercice 1 : Formules (6 pts)
─────────────────────────────
Écrire la formule de :
- Eau : $H_2O$
- Dioxyde de carbone : $CO_2$

Total : 6 pts ✨
```

---

## 🎯 Workflow Complet

### Création d'un Examen

```
1. Créer un nouvel examen
   └─ Cliquez sur "New Exam"

2. Ajouter l'en-tête
   └─ Header Component
   └─ Remplir : Titre, Année, Semestre, Durée

3. Créer les exercices
   └─ Exercise Header Component
   └─ Numéro + Titre + Points

4. Ajouter les questions
   └─ Text Field (avec/sans LaTeX)
   └─ QCM (avec/sans LaTeX)
   └─ Vrai/Faux
   └─ etc.

5. Ajouter les points
   └─ Champ "Points" dans chaque composant
   └─ Le résumé se met à jour automatiquement

6. Vérifier le résumé
   └─ Voir le total en bas à droite
   └─ Vérifier la répartition

7. Sauvegarder
   └─ Cliquez sur "Save"

8. Exporter en PDF
   └─ Cliquez sur "Export PDF"
   └─ Les équations LaTeX sont incluses ✨
```

---

## 💡 Astuces

### LaTeX
✅ **Testez la prévisualisation** avant d'exporter
✅ **Utilisez `$$`** pour les grandes équations
✅ **Ajoutez des espaces** autour des $ pour la lisibilité
✅ **Bouton "Insérer exemples"** pour voir des exemples
✅ **Police mono** dans l'éditeur pour mieux voir la syntaxe

### Scoring
✅ **Vérifiez le résumé** pendant la création
✅ **Total en temps réel** : pas besoin de calculer manuellement
✅ **Répartition par type** : voir où sont les points
✅ **Nombre d'exercices** : s'assurer de la structure

---

## 📚 Ressources

### Documentation
- **PHASE3_GUIDE.md** : Guide complet et détaillé
- **PHASE3_COMPLETE.md** : Récapitulatif technique

### LaTeX
- **KaTeX Documentation** : https://katex.org/docs/supported.html
- **Exemples dans l'appli** : Bouton "Insérer exemples"

---

## 🔥 Commandes Pratiques

```bash
# Installation complète
npm run install-all

# Démarrer tout
npm run dev

# Démarrer uniquement le frontend
npm run dev:frontend

# Démarrer uniquement le backend
npm run dev:backend

# Build pour production
npm run build
```

---

## 🎨 Symboles LaTeX Courants

| Symbole | Code | Rendu |
|---------|------|-------|
| Fraction | `\frac{a}{b}` | a/b |
| Racine | `\sqrt{x}` | √x |
| Puissance | `x^2` | x² |
| Indice | `x_i` | xᵢ |
| Somme | `\sum` | Σ |
| Intégrale | `\int` | ∫ |
| Pi | `\pi` | π |
| Alpha | `\alpha` | α |
| Infini | `\infty` | ∞ |

---

## ✨ Fonctionnalités Complètes

### Phase 1 ✅
- Authentification
- CRUD Examens
- Composants de base

### Phase 2 ✅
- Drag & Drop
- 9 types de composants
- Export PDF
- Banque de questions
- Templates

### Phase 3 ✅ (NOUVEAU)
- **Scoring automatique**
- **Support LaTeX**
- **Prévisualisation temps réel**
- **Export PDF avec équations**

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

**Q: LaTeX ne s'affiche pas ?**
R: Vérifiez que les $ sont bien fermés : `$x^2$` ✓ pas `$x^2`

**Q: Export PDF ne fonctionne pas ?**
R: Attendez que les équations soient chargées avant d'exporter

**Q: Le résumé ne s'affiche pas ?**
R: Ajoutez au moins un composant avec des points

**Q: Comment tester LaTeX ?**
R: Utilisez le bouton "Insérer exemples" dans Text Field

---

## 🎊 C'est Parti !

Votre plateforme est **prête** à créer des examens professionnels avec :
- ✨ Scoring automatique
- 🧮 Équations mathématiques
- 📊 Visualisation temps réel
- 📄 Export PDF de qualité

**Bon courage pour vos examens ! 🎓**

---

**Version :** 3.0.0
**Date :** 19 Décembre 2025
