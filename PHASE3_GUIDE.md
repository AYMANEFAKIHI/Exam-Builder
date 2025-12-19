# 🎯 Guide des Nouvelles Fonctionnalités - Phase 3

## 📊 Système de Scoring Automatique

### Résumé Flottant (ExamSummary)

Un composant de résumé intelligent apparaît automatiquement en bas à droite de votre écran lors de la création d'un examen.

**Fonctionnalités :**
- ✅ **Calcul automatique** du total de points en temps réel
- ✅ **Nombre d'exercices** affichés
- ✅ **Répartition détaillée** par type de composant
- ✅ **Compte des composants** total

**Ce qui est compté :**
- Text Field avec points
- QCM avec points
- Vrai/Faux avec points
- Texte à trous avec points
- Zone de rédaction avec points
- Tableaux avec points
- En-têtes d'exercice avec points

**Exemple de calcul :**
```
Exercice 1: 8 pts
├─ QCM : 3 pts
├─ Text : 2 pts
└─ Tableau : 3 pts

Exercice 2: 12 pts
├─ Vrai/Faux : 4 pts
├─ Text : 5 pts
└─ Zone rédaction : 3 pts

TOTAL : 20 pts ✨
```

---

## 🧮 Support LaTeX (Équations Mathématiques)

### Activation de LaTeX

LaTeX est disponible dans les composants suivants :
1. **Text Field**
2. **QCM (Question + Options)**
3. **Vrai/Faux (Énoncés)**
4. **Texte à trous**

### Syntaxe LaTeX

#### Équations Inline
Utilisez `$` pour des équations dans le texte :
```
La formule de Pythagore est $x^2 + y^2 = z^2$
```

**Rendu :** La formule de Pythagore est x² + y² = z²

#### Équations Display (Bloc)
Utilisez `$$` pour des équations centrées :
```
$$\int_0^1 x^2 dx = \frac{1}{3}$$
```

**Rendu :** ∫₀¹ x² dx = 1/3 (centré et plus grand)

### Exemples LaTeX Courants

#### 1. **Algèbre**
```latex
$x^2 + 2x + 1 = 0$
$\sqrt{x}$
$\frac{a}{b}$
```

#### 2. **Calcul**
```latex
$$\lim_{x \to \infty} \frac{1}{x} = 0$$
$$\frac{d}{dx}(x^2) = 2x$$
$$\int x^n dx = \frac{x^{n+1}}{n+1} + C$$
```

#### 3. **Géométrie**
```latex
$\angle ABC = 90°$
$\overline{AB} \perp \overline{CD}$
$\triangle ABC$
```

#### 4. **Physique**
```latex
$E = mc^2$
$F = ma$
$$v = v_0 + at$$
```

#### 5. **Chimie**
```latex
$H_2O$
$CO_2$
$CH_4$
```

#### 6. **Symboles Grecs**
```latex
$\alpha, \beta, \gamma, \delta$
$\pi, \sigma, \omega$
$\Delta, \Sigma, \Omega$
```

### Utilisation dans les Composants

#### Text Field avec LaTeX
1. Créez un bloc **Text Field**
2. Cochez **"Enable LaTeX"**
3. Tapez votre texte avec des équations :
   ```
   Résoudre l'équation suivante :
   $$x^2 - 5x + 6 = 0$$
   
   Indication : Utilisez $\Delta = b^2 - 4ac$
   ```
4. Une **prévisualisation en temps réel** apparaît en dessous !

#### QCM avec LaTeX
1. Créez un bloc **QCM**
2. Cochez **"Enable LaTeX in question"** pour la question
3. Pour chaque option, cochez **"LaTeX"** si nécessaire
4. Exemple de question :
   ```
   Quelle est la dérivée de $f(x) = x^3 + 2x$ ?
   ```
5. Options :
   - A) `$3x^2 + 2$` (avec LaTeX activé)
   - B) `$x^2 + 2$` (avec LaTeX activé)
   - C) `$3x^2$` (avec LaTeX activé)

#### Vrai/Faux avec LaTeX
1. Créez un bloc **Vrai/Faux**
2. Pour chaque énoncé, cochez **"LaTeX"**
3. Exemple :
   ```
   La dérivée de $\sin(x)$ est $\cos(x)$
   ```

### Aperçu et Export PDF

#### Prévisualisation
- Les équations LaTeX sont **rendues en temps réel** dans l'éditeur
- Une section "Prévisualisation LaTeX" apparaît automatiquement quand LaTeX est activé

#### Export PDF
- Les équations LaTeX sont **automatiquement incluses** dans le PDF
- Le rendu est **professionnel** et de haute qualité
- Compatible avec tous les symboles mathématiques

### Astuces et Conseils

#### ✅ Bonnes Pratiques
1. **Testez toujours** : Vérifiez la prévisualisation avant d'exporter
2. **Espaces** : Ajoutez des espaces autour des $ pour plus de lisibilité
3. **Complexité** : Privilégiez `$$` pour les équations complexes
4. **Documentation** : Référez-vous à [KaTeX Documentation](https://katex.org/docs/supported.html)

#### ⚠️ À Éviter
1. ❌ Ne pas fermer les $ : `$x^2 + y^2` (manque le $ final)
2. ❌ Mélanger les styles : `$x^2$$ (incohérent)
3. ❌ Commandes non supportées : Toutes les commandes LaTeX ne sont pas disponibles

#### 🎯 Raccourcis Utiles
- **Bouton "Insérer exemples"** : Dans Text Field, cliquez pour voir des exemples
- **Prévisualisation instantanée** : Activez/désactivez LaTeX pour comparer
- **Style mono** : Le champ de texte utilise une police mono pour faciliter l'édition

### Symboles et Commandes Fréquents

| Symbole | Code LaTeX | Rendu |
|---------|------------|-------|
| Fraction | `\frac{a}{b}` | a/b |
| Racine carrée | `\sqrt{x}` | √x |
| Puissance | `x^2` | x² |
| Indice | `x_i` | xᵢ |
| Somme | `\sum_{i=1}^{n}` | Σ |
| Intégrale | `\int_a^b` | ∫ |
| Limite | `\lim_{x \to 0}` | lim |
| Infini | `\infty` | ∞ |
| Plus/Moins | `\pm` | ± |
| Multiplication | `\times` | × |
| Division | `\div` | ÷ |
| Différent | `\neq` | ≠ |
| Inférieur/Égal | `\leq` | ≤ |
| Supérieur/Égal | `\geq` | ≥ |

### Exemples d'Examens avec LaTeX

#### Examen de Mathématiques
```
Exercice 1 : Dérivées (8 pts)

1. Calculer $\frac{d}{dx}(x^3 + 2x^2 - 5x + 1)$

2. QCM: Quelle est la dérivée de $\sin(2x)$ ?
   A) $2\cos(2x)$ ✓
   B) $\cos(2x)$
   C) $-2\sin(2x)$

3. Résoudre l'équation différentielle :
   $$\frac{dy}{dx} = 2x + 3$$
```

#### Examen de Physique
```
Exercice 2 : Cinématique (12 pts)

La position d'un objet est donnée par :
$$x(t) = x_0 + v_0 t + \frac{1}{2}at^2$$

Où $x_0 = 0$, $v_0 = 5 \, m/s$, et $a = 2 \, m/s^2$.

Calculer la vitesse à $t = 3s$ sachant que $v = v_0 + at$.
```

#### Examen de Chimie
```
Exercice 3 : Stœchiométrie (10 pts)

Équilibrer la réaction suivante :
$$C_3H_8 + O_2 \rightarrow CO_2 + H_2O$$

Vrai ou Faux :
1. La molécule $H_2SO_4$ est l'acide sulfurique ✓
2. $NaCl$ représente le chlorure de sodium ✓
```

---

## 🚀 Workflow Complet

### Création d'un Examen Professionnel

1. **Créer l'en-tête** (Header Component)
2. **Ajouter les exercices** (Exercise Header Component)
3. **Insérer les questions** avec LaTeX si nécessaire
4. **Vérifier le scoring** dans le résumé flottant
5. **Prévisualiser** l'examen
6. **Exporter en PDF** avec équations rendues

### Avantages de ces Fonctionnalités

✨ **Professionnel** : Équations mathématiques de qualité publication
📊 **Automatique** : Plus besoin de calculer les points manuellement
⚡ **Temps réel** : Voir immédiatement les changements
🎯 **Précis** : Éviter les erreurs de calcul
📄 **Export parfait** : PDF avec LaTeX intégré

---

## 💡 Support et Ressources

### Documentation KaTeX
Pour la liste complète des commandes supportées :
🔗 https://katex.org/docs/supported.html

### Aide Rapide
- **Problème de rendu ?** Vérifiez que les $ sont bien fermés
- **Commande inconnue ?** Consultez la doc KaTeX
- **Export PDF ?** Les équations sont automatiquement incluses

---

**Version :** Phase 3 - Scoring & LaTeX
**Date :** Décembre 2025
**Auteur :** Interactive Exam Builder Team
