<div class="prose prose-invert max-w-fit">
  <h1>Manuel d'utilisation du Roast Meter</h1>
  <p class="text-gray-400">Version 1.0.2</p>

  <h2>Pourquoi mesurer la couleur de la torréfaction ?</h2>
  <p>La couleur de la torréfaction est corrélée au goût du café et, avec d'autres données, elle fournit un moyen de corroborer la qualité d’un café.</p>
  
  <h3>Utilisation prévue du Roast Meter</h3>
  <p>Le <b>Roast Meter</b> est destiné à être utilisé par les torréfacteurs amateurs et les consommateurs de café pour évaluer la couleur de leur café à des fins de contrôle qualité. Le <b>Roast Meter</b> remplace l'utilisation des cartes de couleur de torréfaction et des descripteurs obsolètes par quelque chose d’un peu plus quantifiable et partageable avec d'autres.</p>

  <h3>Instructions générales d'utilisation</h3>
  <p>Que vous soyez en train d'étalonner ou de prendre des mesures, veuillez suivre ces consignes générales lors de l'utilisation du <b>Roast Meter</b> :</p>
  <ul>
    <li>Allumez le Roast Meter et laissez-le se stabiliser pendant 3 à 5 minutes.</li>
    <li>Utilisez-le à température ambiante avec des substances à température ambiante.</li>
    <li>Si la vitre du capteur est sale, nettoyez-la avec de l'alcool isopropylique.</li>
    <li>Si la substance forme des grumeaux, envisagez de faire un WDT avant de l’appliquer sur le capteur.</li>
    <li>Appliquez suffisamment de café moulu sur le capteur pour que le creux circulaire imprimé en 3D soit complètement recouvert.</li>
    <li>Utilisez une méthode cohérente pour tasser la substance avant de prendre une mesure.</li>
    <li>Après la mesure, retirez la substance avec une brosse à poils souples, et nettoyez avec de l'alcool isopropylique si nécessaire.</li>
  </ul>

  <hr>

  <h2>Étalonnage</h2>
  <p>Idéalement, chaque <b>Roast Meter</b> serait étalonné en comparaison avec des appareils et substances de référence. Mais comme il s'agit d’un dispositif open source et assemblé par l’utilisateur, cela n’est pas possible.</p>
  <p>L’étalonnage est donc réalisé par substitution, en utilisant des substances de référence couramment disponibles et des plages cibles associées. Ces cibles ont été établies à partir de tests initiaux avec le CM100 et sont mises à jour à l’aide de données collectées de manière collaborative auprès des utilisateurs.</p>

  <h3>Bicarbonate de soude</h3>
  <ul>
    <li>Appliquez une cuillère à café bien remplie sur le capteur (env. 5 à 7 g)</li>
    <li>L’objectif de lecture visé est d’environ 230 sur l’écran</li>
    <li>Relevez la lecture affichée à l’écran</li>
    <li>Retirez la substance et répétez plusieurs fois pour obtenir une moyenne</li>
    <li>Modifiez la variable <b>ledBrightness</b> à la hausse ou à la baisse d’une unité selon la moyenne obtenue</li>
  </ul>
  <p>Par exemple, si la moyenne est inférieure à la valeur cible, augmentez ledBrightness, et inversement</p>

  <hr>

  <h2>Mesure du café</h2>

  <p>La couleur change avec l’âge de la torréfaction et les conditions de stockage. Si possible, essayez de mesurer le café à un âge et dans des conditions similaires.
  Pour les torréfacteurs, les meilleures pratiques générales consistent à tester 1 à 2 heures après la torréfaction. Essayez de faire les mesures à des moments constants après la torréfaction.</p>

  <h3>Moulins et taille de mouture</h3>
  <p>Une mouture régulière à une taille de particule appropriée est très importante. Il peut y avoir une différence de 20 à 25 points simplement en changeant les réglages de broyage sur le même moulin.</p>
  <p>Le <b>Roast Meter</b> lit la lumière réfléchie par le café tassé placé sur la vitre du capteur.</p>
  <p>La mouture d’un même café peut produire des lectures différentes en raison de plusieurs facteurs :</p>
  <ul>
    <li>Différents jeux de meules produisent des distributions de tailles de particules différentes, même avec le même réglage de microns</li>
    <li>L’origine du café, le niveau de torréfaction, le stockage et l’âge peuvent également influencer la granulométrie obtenue avec le même moulin</li>
    <li>Lorsque des résultats précis sont nécessaires, tamisez le café moulu avant de mesurer. Le tamisage aide aussi à retirer les pellicules (chaff) qui peuvent affecter la lecture.</li>
    <li>Les tests indiquent que des moutures tamisées de moins de 500 microns produisent des lectures répétables sur le Roast Meter. Cela pourra évoluer avec les futures données.</li>
    <li>Pour ceux qui ne possèdent pas de tamis ou d'équipement de mesure de mouture, broyez aussi finement que possible et utilisez toujours le même réglage (par exemple : espresso fin ou mouture turque), sans aller jusqu’à créer des grumeaux.</li>
  </ul>

  <h3>Tests</h3>
  <p>Un utilisateur peut effectuer un test ponctuel pour vérifier un café. Mais pour plus de précision, la procédure suivante est recommandée :</p>
  <ul>
    <li>Prélevez plusieurs échantillons de grains du même sachet ou de la même torréfaction et retirez les grains défectueux (quakers)</li>
    <li>La quantité nécessaire pour couvrir le capteur dépendra du moulin et de la mouture, mais commencez par 3 à 5 g de café en grains par échantillon</li>
    <li>Moulez chaque échantillon, appliquez-le sur le capteur et tassez. Notez la lecture affichée</li>
    <li>Pour chaque échantillon, retirez et réappliquez le café plusieurs fois pour vérifier la cohérence des lectures</li>
    <li>Entre chaque mesure, brossez le capteur avec une brosse à poils souples</li>
    <li>Répétez le processus pour chaque échantillon, puis faites la moyenne de toutes les lectures pour obtenir un résultat final</li>
  </ul>

  <h4>Exemple :</h4>
  <ul>
    <li>Prélevez 3 échantillons distincts de 5 g chacun et placez-les dans des tasses.</li>
    <li>Moulez le premier échantillon, appliquez-le sur le capteur, prenez une lecture, remettez-le dans la tasse, réappliquez-le et reprenez la lecture, 3 fois au total.</li>
    <li>Jetez l’échantillon et passez au suivant.</li>
    <li>Cela donne 9 lectures au total pour un café, dont vous ferez la moyenne.</li>
  </ul>

  <hr>

  <h2>Releases</h2>

  <ul>
    <li><b>1.0.2</b> - Ajout d'un systeme pour l'écran du télephone reste allumé sur le <b>Roast meter</b> est connecté</li>
    <li><b>1.0.1</b> - Mise à jour des dépendances</li>
    <li><b>1.0.0</b> - Premiere version de l'application</li>
  </ul>

  <hr>

  <h2>Partage</h2>

  <div>
    <img src="/SharingRoastPilot.svg" alt="Sharing" class="mx-auto my-8 bg-white rounded-2xl shadow-xl size-72" />
  </div>
</div>