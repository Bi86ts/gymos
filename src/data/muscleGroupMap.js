// Maps muscle group selections to anatomical detail, exercise IDs, and Sketchfab node names

const muscleGroupMap = {
  Chest: {
    anatomicalNames: ['Pectoralis Major', 'Pectoralis Minor', 'Serratus Anterior'],
    icon: 'sports_martial_arts',
    color: '#C8FF00',
    description: 'The prime movers for pushing. Build a powerful chest with presses and flyes.',
    exerciseIds: ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10','ch11','ch12','ch13','ch14','ch15'],
    // Sketchfab node name keywords for click detection
    sketchfabKeywords: ['pectoralis', 'pec', 'chest', 'sternum'],
  },
  Back: {
    anatomicalNames: ['Latissimus Dorsi', 'Rhomboids', 'Erector Spinae', 'Trapezius', 'Teres Major'],
    icon: 'swap_vert',
    color: '#00D4FF',
    description: 'The foundation of upper body strength. Rows, pulls, and deadlifts build width and thickness.',
    exerciseIds: ['bk1','bk2','bk3','bk4','bk5','bk6','bk7','bk8','bk9','bk10','bk11','bk12','bk13','bk14','bk15'],
    sketchfabKeywords: ['latissimus', 'lat', 'rhomboid', 'erector', 'teres', 'infraspinatus'],
  },
  Shoulders: {
    anatomicalNames: ['Anterior Deltoid', 'Medial Deltoid', 'Posterior Deltoid', 'Rotator Cuff', 'Trapezius'],
    icon: 'accessibility_new',
    color: '#FFB800',
    description: 'Capping the shoulders gives a V-taper. Press and raise for width and definition.',
    exerciseIds: ['sh1','sh2','sh3','sh4','sh5','sh6','sh7','sh8','sh9','sh10','sh11','sh12','tp1','tp2','tp3','tp7','tp8'],
    sketchfabKeywords: ['deltoid', 'delt', 'shoulder', 'trapez', 'supraspinatus'],
  },
  Arms: {
    anatomicalNames: ['Biceps Brachii', 'Brachialis', 'Triceps Brachii', 'Forearm Flexors', 'Forearm Extensors'],
    icon: 'fitness_center',
    color: '#A855F7',
    description: 'Biceps, triceps, and forearms — curls, extensions, and grip work build complete arms.',
    exerciseIds: ['bi1','bi2','bi3','bi4','bi5','bi6','bi7','bi8','bi9','bi10','tr1','tr2','tr3','tr4','tr5','tr6','tr7','tr8','tr9','tr10','tp4','tp5','tp6'],
    sketchfabKeywords: ['bicep', 'tricep', 'brachialis', 'brachioradialis', 'forearm', 'pronator', 'supinator'],
  },
  Legs: {
    anatomicalNames: ['Quadriceps', 'Hamstrings', 'Gastrocnemius', 'Soleus', 'Adductors', 'Tibialis'],
    icon: 'directions_walk',
    color: '#FF3366',
    description: 'Never skip leg day. Squats, deadlifts, lunges, and calf raises build a powerful base.',
    exerciseIds: ['lg1','lg2','lg3','lg4','lg5','lg6','lg7','lg8','lg9','lg10','hm1','hm2','hm3','hm4','hm5','hm6','hm7','hm8','cv1','cv2','cv3','cv4','cv5'],
    sketchfabKeywords: ['quadricep', 'vastus', 'rectus femoris', 'hamstring', 'gastrocnemius', 'soleus', 'tibialis', 'adductor', 'sartorius'],
  },
  Core: {
    anatomicalNames: ['Rectus Abdominis', 'Transverse Abdominis', 'Internal Obliques', 'External Obliques'],
    icon: 'self_improvement',
    color: '#FF6B35',
    description: 'The foundation of all movement. A strong core protects the spine and transfers power.',
    exerciseIds: ['co1','co2','co3','co4','co5','co6','co7','co8','co9','co10','co11','co12'],
    sketchfabKeywords: ['abdomin', 'oblique', 'rectus', 'transverse', 'abs'],
  },
  Glutes: {
    anatomicalNames: ['Gluteus Maximus', 'Gluteus Medius', 'Gluteus Minimus', 'Piriformis'],
    icon: 'sprint',
    color: '#FF1493',
    description: 'The most powerful muscle group. Hip thrusts, squats, and kickbacks build explosive strength.',
    exerciseIds: ['gl1','gl2','gl3','gl4','gl5','gl6','gl7','gl8','gl9','gl10'],
    sketchfabKeywords: ['gluteus', 'glute', 'piriformis'],
  },
  'Full Body': {
    anatomicalNames: ['Multiple Muscle Groups', 'Compound Movements'],
    icon: 'exercise',
    color: '#00E5A0',
    description: 'Compound exercises that hit everything. Burpees, thrusters, cleans — maximum efficiency.',
    exerciseIds: ['fb1','fb2','fb3','fb4','fb5','fb6','fb7','fb8','fb9','fb10','fb11','fb12','fb13','fb14','fb15'],
    sketchfabKeywords: [],
  },
}

/**
 * Detect which muscle group a Sketchfab node name belongs to
 * @param {string} nodeName - Name of the clicked node from Sketchfab API
 * @returns {string|null} - Muscle group name or null
 */
export function detectMuscleFromNode(nodeName) {
  if (!nodeName) return null
  const lower = nodeName.toLowerCase()
  for (const [group, data] of Object.entries(muscleGroupMap)) {
    if (data.sketchfabKeywords.some(kw => lower.includes(kw))) {
      return group
    }
  }
  return null
}

export default muscleGroupMap
