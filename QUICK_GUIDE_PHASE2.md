# 🎓 Guide Rapide - Nouveaux Blocs Pédagogiques

## 🚀 Accès Rapide

Dans l'**Exam Builder**, la barre latérale gauche contient maintenant :

### Blocs de Base
- 📋 Header
- 📝 Text Field
- 📊 Table
- ☑️ QCM
- 🖼️ Image

### 🆕 Blocs Avancés (Nouveaux!)
- 🎯 **Exercice avec Barème** - Titre d'exercice avec points en gras
- ✅ **Vrai/Faux** - Liste d'énoncés avec colonnes V/F
- ✏️ **Texte à Trous** - Mots à compléter automatiques
- 📄 **Zone de Rédaction** - Espace avec lignes/carreaux

---

## 📝 Exemples d'Utilisation

### 1. Créer un Exercice Structuré

```
┌─────────────────────────────────────┐
│ [Bloc: Exercice avec Barème]       │
│ Exercice 1 : Calcul de dérivées    │
│                          / 10 pts   │
└─────────────────────────────────────┘

[Bloc: Texte à Trous]
Calculer la dérivée de f(x) = x²
La dérivée est [2x].

[Bloc: Zone de Rédaction - 5 lignes]
(Espace pour la réponse détaillée)
```

### 2. Créer un Quiz Vrai/Faux

```
[Bloc: Vrai/Faux - Style Cercles]
1. La Terre est ronde          ○ Vrai  ○ Faux
2. Paris est en Allemagne      ○ Vrai  ○ Faux
3. 2+2=4                       ○ Vrai  ○ Faux
```

### 3. Créer un Exercice de Langue

```
[Bloc: Exercice avec Barème]
Exercice 2 : Compléter les phrases
                           / 5 pts

[Bloc: Texte à Trous]
The capital of France is [Paris].
I [am] a student.
She [likes] chocolate.
```

---

## 💡 Astuces Pro

### Texte à Trous
**Syntaxe** : `[mot]` → devient `___________` dans le PDF

**Exemple** :
```
Saisie : La capitale de la France est [Paris].
PDF    : La capitale de la France est ___________.
```

### Dupliquer un Bloc
1. Cliquez sur l'icône 📋 (Copy) bleue
2. Le bloc est copié instantanément en bas
3. Modifiez la copie selon vos besoins

### Vrai/Faux
- **Cercles** : Rendu minimaliste (○)
- **Lettres V/F** : Rendu explicite (cases V et F)

### Zone de Rédaction
- **Lignes** : Pour écriture normale
- **Carreaux** : Pour graphiques ou formules

---

## 🎯 Compteur de Points

Le **Total de l'examen** est affiché :
- ✅ En haut à côté du titre
- ✅ En bas de la page (grand format)

**Mise à jour automatique** dès que vous modifiez les points d'un bloc !

---

## 🎨 Codes Couleur des Blocs

Pour faciliter l'identification visuelle :

- 🟢 **Vrai/Faux** : Bordure verte
- 🟣 **Texte à Trous** : Bordure violette
- 🟠 **Zone de Rédaction** : Bordure orange
- 🔵 **Exercice avec Barème** : Bordure indigo

---

## 📄 Export PDF

**Tous les nouveaux blocs sont automatiquement exportés** dans le PDF avec :
- Style académique épuré
- Mise en page professionnelle
- Respect des choix de style (cercles/lettres, lignes/carreaux)

**Boutons disponibles** :
- 💾 **Save** : Sauvegarder l'examen
- 📥 **Export PDF** : Générer le PDF de l'examen
- 📋 **Correction Grid** : Générer la grille de correction

---

## ⚡ Raccourcis Clavier (À venir)

Pour l'instant, utilisez la souris. Des raccourcis seront ajoutés dans une future version :
- `Ctrl + D` : Dupliquer le bloc sélectionné
- `Ctrl + ↑/↓` : Déplacer le bloc
- `Delete` : Supprimer le bloc

---

## 🆘 Problèmes Courants

### Le texte à trous ne fonctionne pas
✅ Vérifiez que vous utilisez bien des **crochets** `[mot]` et non des parenthèses

### Les lignes ne s'affichent pas dans la zone de rédaction
✅ C'est normal dans l'éditeur. Les lignes apparaissent dans le **PDF final**

### Le total des points ne se met pas à jour
✅ Assurez-vous de bien remplir le champ "Points" dans chaque bloc

### Le bouton Dupliquer ne fonctionne pas
✅ Vérifiez que votre navigateur est à jour (Chrome, Firefox, Edge)

---

## 🎓 Cas d'Usage Pédagogiques

### Pour les Profs de Maths/Sciences
1. **Exercice avec Barème** pour structurer
2. **Zone de Rédaction** pour les calculs
3. **Texte à Trous** pour les formules

### Pour les Profs de Langues
1. **Texte à Trous** pour grammaire/vocabulaire
2. **Vrai/Faux** pour compréhension
3. **Zone de Rédaction** pour rédaction libre

### Pour les Profs d'Histoire/Géo
1. **Vrai/Faux** pour dates/événements
2. **Texte à Trous** pour chronologies
3. **QCM** pour questions de cours

---

**Besoin d'aide ?** Consultez [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md) pour la documentation technique complète.
