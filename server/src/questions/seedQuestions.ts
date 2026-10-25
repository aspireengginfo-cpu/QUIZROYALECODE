import { QuestionData } from '../types';

export const SEED_QUESTIONS: QuestionData[] = [
  // ==========================================
  // SCIENCE (15 questions)
  // ==========================================
  {
    questionId: 'sci-001',
    category: 'Science',
    difficulty: 'easy',
    question: 'Which organelle is commonly referred to as the "powerhouse of the cell"?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
    correctIndex: 1,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell biochemical reactions (ATP).'
  },
  {
    questionId: 'sci-002',
    category: 'Science',
    difficulty: 'easy',
    question: 'What is the chemical symbol for the element Gold?',
    options: ['Ag', 'Fe', 'Au', 'Pb'],
    correctIndex: 2,
    explanation: 'Au comes from the Latin word for gold, "aurum", meaning shining dawn.'
  },
  {
    questionId: 'sci-003',
    category: 'Science',
    difficulty: 'medium',
    question: 'What is the approximate speed of light in a vacuum?',
    options: ['150,000 km/s', '300,000 km/s', '450,000 km/s', '1,080,000 km/s'],
    correctIndex: 1,
    explanation: 'The speed of light in vacuum is exactly 299,792,458 metres per second (approx. 300,000 km/s).'
  },
  {
    questionId: 'sci-004',
    category: 'Science',
    difficulty: 'medium',
    question: 'Which gas makes up approximately 78% of Earth’s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Argon', 'Nitrogen'],
    correctIndex: 3,
    explanation: 'Nitrogen constitutes roughly 78.08% of dry air in the Earth atmosphere.'
  },
  {
    questionId: 'sci-005',
    category: 'Science',
    difficulty: 'medium',
    question: 'What is the most abundant element in the universe by mass?',
    options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'],
    correctIndex: 1,
    explanation: 'Hydrogen accounts for roughly 75% of the normal baryonic mass of the universe.'
  },
  {
    questionId: 'sci-006',
    category: 'Science',
    difficulty: 'hard',
    question: 'What fundamental particle carries the electromagnetic force?',
    options: ['Gluon', 'Z Boson', 'Photon', 'Graviton'],
    correctIndex: 2,
    explanation: 'Photons are the gauge bosons responsible for mediating the electromagnetic force.'
  },
  {
    questionId: 'sci-007',
    category: 'Science',
    difficulty: 'easy',
    question: 'How many bones are in the adult human body?',
    options: ['198', '206', '214', '222'],
    correctIndex: 1,
    explanation: 'An adult human typically has 206 distinct bones, after infantile bones fuse together.'
  },
  {
    questionId: 'sci-008',
    category: 'Science',
    difficulty: 'medium',
    question: 'What is absolute zero in degrees Celsius?',
    options: ['-100 °C', '-212 °C', '-273.15 °C', '-459.67 °C'],
    correctIndex: 2,
    explanation: 'Absolute zero corresponds to 0 Kelvin or -273.15 degrees on the Celsius scale.'
  },
  {
    questionId: 'sci-009',
    category: 'Science',
    difficulty: 'medium',
    question: 'Which planet has the strongest magnetic field in the Solar System?',
    options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'],
    correctIndex: 1,
    explanation: 'Jupiter has a colossal magnetosphere, thousands of times stronger than Earth.'
  },
  {
    questionId: 'sci-010',
    category: 'Science',
    difficulty: 'easy',
    question: 'What type of lens is used to correct nearsightedness (myopia)?',
    options: ['Concave lens', 'Convex lens', 'Cylindrical lens', 'Bifocal lens'],
    correctIndex: 0,
    explanation: 'Diverging (concave) lenses spread light rays slightly before entering the eye to correct myopia.'
  },
  {
    questionId: 'sci-011',
    category: 'Science',
    difficulty: 'medium',
    question: 'What is the pH level of pure, neutral distilled water at 25°C?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
    explanation: 'At 25°C, pure neutral water has an equal concentration of H+ and OH- ions, resulting in a pH of 7.'
  },
  {
    questionId: 'sci-012',
    category: 'Science',
    difficulty: 'hard',
    question: 'Which law states that the total entropy of an isolated system always increases over time?',
    options: ['First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Third Law of Thermodynamics', 'Zeroth Law of Thermodynamics'],
    correctIndex: 1,
    explanation: 'The Second Law of Thermodynamics dictates that entropy in an isolated system can never decrease.'
  },
  {
    questionId: 'sci-013',
    category: 'Science',
    difficulty: 'easy',
    question: 'Which blood cells are responsible for carrying oxygen throughout the human body?',
    options: ['Leukocytes', 'Erythrocytes (Red Blood Cells)', 'Thrombocytes (Platelets)', 'Lymphocytes'],
    correctIndex: 1,
    explanation: 'Erythrocytes contain hemoglobin, the iron-rich protein that binds and transports oxygen.'
  },
  {
    questionId: 'sci-014',
    category: 'Science',
    difficulty: 'medium',
    question: 'What is the SI unit of electrical resistance?',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    correctIndex: 2,
    explanation: 'The Ohm (symbol: Ω) is named after German physicist Georg Simon Ohm.'
  },
  {
    questionId: 'sci-015',
    category: 'Science',
    difficulty: 'hard',
    question: 'Which chemical element has the highest melting point of all metals?',
    options: ['Titanium', 'Tungsten', 'Platinum', 'Osmium'],
    correctIndex: 1,
    explanation: 'Tungsten (W) has a melting point of 3,422 °C (6,192 °F), the highest of any metal.'
  },

  // ==========================================
  // GEOGRAPHY (15 questions)
  // ==========================================
  {
    questionId: 'geo-001',
    category: 'Geography',
    difficulty: 'easy',
    question: 'What is the capital city of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctIndex: 2,
    explanation: 'Canberra was chosen as a compromise site between rivals Sydney and Melbourne in 1908.'
  },
  {
    questionId: 'geo-002',
    category: 'Geography',
    difficulty: 'easy',
    question: 'Which is the largest ocean on Earth by surface area?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctIndex: 3,
    explanation: 'The Pacific Ocean covers over 165 million square kilometers, covering roughly 32% of Earth surface.'
  },
  {
    questionId: 'geo-003',
    category: 'Geography',
    difficulty: 'medium',
    question: 'Which country has the longest coastline in the world?',
    options: ['Russia', 'Canada', 'Indonesia', 'Norway'],
    correctIndex: 1,
    explanation: 'Canada boasts the longest coastline in the world, spanning over 243,042 kilometers.'
  },
  {
    questionId: 'geo-004',
    category: 'Geography',
    difficulty: 'easy',
    question: 'In which mountain range is Mount Everest located?',
    options: ['Andes', 'Alps', 'Himalayas', 'Rockies'],
    correctIndex: 2,
    explanation: 'Mount Everest stands on the border of Nepal and China in the Himalayan mountain range.'
  },
  {
    questionId: 'geo-005',
    category: 'Geography',
    difficulty: 'medium',
    question: 'What is the deepest known oceanic trench on Earth?',
    options: ['Java Trench', 'Puerto Rico Trench', 'Mariana Trench', 'Tonga Trench'],
    correctIndex: 2,
    explanation: 'The Mariana Trench reaches a maximum depth of approximately 10,994 meters at Challenger Deep.'
  },
  {
    questionId: 'geo-006',
    category: 'Geography',
    difficulty: 'medium',
    question: 'Which river flows through the city of Paris?',
    options: ['Danube', 'Thames', 'Seine', 'Rhine'],
    correctIndex: 2,
    explanation: 'The Seine River flows right through the historical heart of Paris.'
  },
  {
    questionId: 'geo-007',
    category: 'Geography',
    difficulty: 'medium',
    question: 'What is the smallest independent sovereign state in the world by area?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
    correctIndex: 2,
    explanation: 'Vatican City covers an area of just 0.49 square kilometers (121 acres).'
  },
  {
    questionId: 'geo-008',
    category: 'Geography',
    difficulty: 'easy',
    question: 'Which African nation is known as the "Rainbow Nation"?',
    options: ['Kenya', 'Nigeria', 'South Africa', 'Ghana'],
    correctIndex: 2,
    explanation: 'Archbishop Desmond Tutu coined "Rainbow Nation" to describe post-apartheid South Africa.'
  },
  {
    questionId: 'geo-009',
    category: 'Geography',
    difficulty: 'hard',
    question: 'Which desert is the driest non-polar desert in the world?',
    options: ['Sahara Desert', 'Atacama Desert', 'Gobi Desert', 'Kalahari Desert'],
    correctIndex: 1,
    explanation: 'The Atacama Desert in Chile receives less than 1 mm of rain per year on average.'
  },
  {
    questionId: 'geo-010',
    category: 'Geography',
    difficulty: 'medium',
    question: 'Through which strait do ships pass between the Mediterranean Sea and the Atlantic Ocean?',
    options: ['Strait of Hormuz', 'Strait of Malacca', 'Strait of Gibraltar', 'Bosphorus Strait'],
    correctIndex: 2,
    explanation: 'The Strait of Gibraltar connects the Atlantic Ocean to the Mediterranean Sea and separates Spain from Morocco.'
  },
  {
    questionId: 'geo-011',
    category: 'Geography',
    difficulty: 'hard',
    question: 'Which country has the most natural lakes in the world?',
    options: ['Finland', 'United States', 'Canada', 'Sweden'],
    correctIndex: 2,
    explanation: 'Canada contains more than half of all natural lakes on Earth, with over 879,000 lakes.'
  },
  {
    questionId: 'geo-012',
    category: 'Geography',
    difficulty: 'medium',
    question: 'What is the capital city of New Zealand?',
    options: ['Auckland', 'Christchurch', 'Wellington', 'Hamilton'],
    correctIndex: 2,
    explanation: 'Wellington is the capital of New Zealand and the world southernmost capital city.'
  },
  {
    questionId: 'geo-013',
    category: 'Geography',
    difficulty: 'easy',
    question: 'On which continent is the Amazon Rainforest primarily located?',
    options: ['Africa', 'South America', 'Asia', 'North America'],
    correctIndex: 1,
    explanation: 'About 60% of the Amazon basin is within Brazil, with the rest distributed across eight other South American countries.'
  },
  {
    questionId: 'geo-014',
    category: 'Geography',
    difficulty: 'medium',
    question: 'Which of the Great Lakes is located entirely within the United States?',
    options: ['Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie'],
    correctIndex: 1,
    explanation: 'Lake Michigan is the only one of the five Great Lakes located completely within US territory.'
  },
  {
    questionId: 'geo-015',
    category: 'Geography',
    difficulty: 'hard',
    question: 'What is the highest capital city in the world above sea level?',
    options: ['Quito, Ecuador', 'La Paz, Bolivia', 'Bogotá, Colombia', 'Addis Ababa, Ethiopia'],
    correctIndex: 1,
    explanation: 'La Paz sits at approximately 3,640 meters (11,942 ft) above sea level.'
  },

  // ==========================================
  // HISTORY (15 questions)
  // ==========================================
  {
    questionId: 'his-001',
    category: 'History',
    difficulty: 'easy',
    question: 'In which year did the Apollo 11 mission successfully land astronauts on the Moon?',
    options: ['1965', '1969', '1971', '1973'],
    correctIndex: 1,
    explanation: 'Neil Armstrong and Buzz Aldrin landed the lunar module Eagle on July 20, 1969.'
  },
  {
    questionId: 'his-002',
    category: 'History',
    difficulty: 'easy',
    question: 'Who was the first President of the United States under the US Constitution?',
    options: ['Thomas Jefferson', 'John Adams', 'Benjamin Franklin', 'George Washington'],
    correctIndex: 3,
    explanation: 'George Washington served as the first US president from 1789 to 1797.'
  },
  {
    questionId: 'his-003',
    category: 'History',
    difficulty: 'medium',
    question: 'The ancient city of Carthage was located in the territory of which modern-day nation?',
    options: ['Egypt', 'Tunisia', 'Greece', 'Turkey'],
    correctIndex: 1,
    explanation: 'Carthage was founded by Phoenician settlers on the coast of modern-day Tunisia.'
  },
  {
    questionId: 'his-004',
    category: 'History',
    difficulty: 'medium',
    question: 'In which year did the Berlin Wall fall, signaling the end of the Cold War division?',
    options: ['1987', '1989', '1991', '1993'],
    correctIndex: 1,
    explanation: 'The Berlin Wall fell on November 9, 1989, leading directly to German reunification.'
  },
  {
    questionId: 'his-005',
    category: 'History',
    difficulty: 'hard',
    question: 'Which treaty ended the Thirty Years\' War in Europe in 1648?',
    options: ['Treaty of Utrecht', 'Peace of Westphalia', 'Treaty of Ghent', 'Treaty of Versailles'],
    correctIndex: 1,
    explanation: 'The Peace of Westphalia (1648) established the concept of sovereign nation-states.'
  },
  {
    questionId: 'his-006',
    category: 'History',
    difficulty: 'medium',
    question: 'Who was the famous Macedonian king who conquered the Persian Empire by age 30?',
    options: ['Philip II', 'Pericles', 'Alexander the Great', 'Leonidas'],
    correctIndex: 2,
    explanation: 'Alexander the Great created one of the largest empires of the ancient world before dying in Babylon in 323 BC.'
  },
  {
    questionId: 'his-007',
    category: 'History',
    difficulty: 'easy',
    question: 'Which luxury ship sank in the North Atlantic Ocean on April 15, 1912?',
    options: ['RMS Lusitania', 'RMS Titanic', 'HMHS Britannic', 'SS Andrea Doria'],
    correctIndex: 1,
    explanation: 'The RMS Titanic struck an iceberg during her maiden voyage from Southampton to New York City.'
  },
  {
    questionId: 'his-008',
    category: 'History',
    difficulty: 'medium',
    question: 'Which Chinese dynasty was responsible for beginning construction of the Terracotta Army?',
    options: ['Han Dynasty', 'Tang Dynasty', 'Qin Dynasty', 'Ming Dynasty'],
    correctIndex: 2,
    explanation: 'The Terracotta Army was constructed to protect the first Emperor of China, Qin Shi Huang.'
  },
  {
    questionId: 'his-009',
    category: 'History',
    difficulty: 'medium',
    question: 'In which city was the Magna Carta signed in the year 1215?',
    options: ['London', 'Runnymede', 'Oxford', 'Canterbury'],
    correctIndex: 1,
    explanation: 'King John granted the Magna Carta at Runnymede meadow near Windsor in June 1215.'
  },
  {
    questionId: 'his-010',
    category: 'History',
    difficulty: 'hard',
    question: 'Who was the first woman to win a Nobel Prize and the only person to win in two scientific fields?',
    options: ['Rosalind Franklin', 'Ada Lovelace', 'Marie Curie', 'Lise Meitner'],
    correctIndex: 2,
    explanation: 'Marie Curie won Nobel Prizes in Physics (1903) and Chemistry (1911).'
  },
  {
    questionId: 'his-011',
    category: 'History',
    difficulty: 'medium',
    question: 'What year marked the start of the French Revolution with the storming of the Bastille?',
    options: ['1776', '1789', '1799', '1804'],
    correctIndex: 1,
    explanation: 'The storming of the Bastille on July 14, 1789, is celebrated as French National Day.'
  },
  {
    questionId: 'his-012',
    category: 'History',
    difficulty: 'easy',
    question: 'Which civilization constructed the ancient wonder known as Machu Picchu?',
    options: ['Maya', 'Aztec', 'Inca', 'Olmec'],
    correctIndex: 2,
    explanation: 'Machu Picchu was built as an estate for the Inca emperor Pachacuti in the 15th century.'
  },
  {
    questionId: 'his-013',
    category: 'History',
    difficulty: 'medium',
    question: 'Who led the Salt March in 1930 as a non-violent protest against British colonial rule?',
    options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhas Chandra Bose', 'Sardar Patel'],
    correctIndex: 1,
    explanation: 'Mahatma Gandhi led the 240-mile Salt March to the coastal village of Dandi.'
  },
  {
    questionId: 'his-014',
    category: 'History',
    difficulty: 'hard',
    question: 'What was the ancient trade route connecting China to the Mediterranean region called?',
    options: ['The Royal Road', 'The Amber Road', 'The Silk Road', 'The Spice Route'],
    correctIndex: 2,
    explanation: 'The Silk Road was an ancient network of Eurasian trade routes active from the Han dynasty onwards.'
  },
  {
    questionId: 'his-015',
    category: 'History',
    difficulty: 'medium',
    question: 'Which Renaissance polymath painted "The Last Supper" and the "Mona Lisa"?',
    options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'],
    correctIndex: 2,
    explanation: 'Leonardo da Vinci was an Italian polymath of the High Renaissance active as a painter, draughtsman, and engineer.'
  },

  // ==========================================
  // TECHNOLOGY (15 questions)
  // ==========================================
  {
    questionId: 'tech-001',
    category: 'Technology',
    difficulty: 'easy',
    question: 'What does "HTTP" stand for in web addresses?',
    options: [
      'HyperText Transfer Protocol',
      'High-Speed Text Transmission Program',
      'Hyperlink Technology Total Protocol',
      'HyperText Transmission Package'
    ],
    correctIndex: 0,
    explanation: 'HTTP is the foundational application protocol used for data communication on the World Wide Web.'
  },
  {
    questionId: 'tech-002',
    category: 'Technology',
    difficulty: 'easy',
    question: 'Who is widely credited with inventing the World Wide Web in 1989?',
    options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Vint Cerf'],
    correctIndex: 2,
    explanation: 'Tim Berners-Lee invented the World Wide Web while working at CERN in 1989.'
  },
  {
    questionId: 'tech-003',
    category: 'Technology',
    difficulty: 'medium',
    question: 'Which programming language was created by Brendan Eich in just 10 days in 1995?',
    options: ['Python', 'Ruby', 'Java', 'JavaScript'],
    correctIndex: 3,
    explanation: 'Brendan Eich created JavaScript for the Netscape Navigator browser in May 1995.'
  },
  {
    questionId: 'tech-004',
    category: 'Technology',
    difficulty: 'medium',
    question: 'What does the acronym "SSD" stand for in computing hardware?',
    options: ['Static System Disk', 'Solid-State Drive', 'Synchronous Storage Device', 'Serial Super Drive'],
    correctIndex: 1,
    explanation: 'A Solid-State Drive uses flash memory rather than spinning magnetic platters to store data.'
  },
  {
    questionId: 'tech-005',
    category: 'Technology',
    difficulty: 'hard',
    question: 'Which algorithm is widely used to find the shortest path between nodes in a graph with non-negative edge weights?',
    options: ['Bellman-Ford algorithm', 'Dijkstra’s algorithm', 'Floyd-Warshall algorithm', 'Kruskal’s algorithm'],
    correctIndex: 1,
    explanation: 'Edsger W. Dijkstra published this fundamental pathfinding algorithm in 1959.'
  },
  {
    questionId: 'tech-006',
    category: 'Technology',
    difficulty: 'easy',
    question: 'What does the "CPU" inside a computer stand for?',
    options: ['Central Processing Unit', 'Core Programming Utility', 'Computer Power Unit', 'Central Performance User'],
    correctIndex: 0,
    explanation: 'The Central Processing Unit (CPU) is the primary component that executes computer program instructions.'
  },
  {
    questionId: 'tech-007',
    category: 'Technology',
    difficulty: 'medium',
    question: 'What is the default port number used for secure HTTPS web traffic?',
    options: ['21', '80', '443', '8080'],
    correctIndex: 2,
    explanation: 'Port 443 is the standard port designated for HTTP traffic secured by TLS/SSL encryption.'
  },
  {
    questionId: 'tech-008',
    category: 'Technology',
    difficulty: 'medium',
    question: 'In computer science, what time complexity is considered "logarithmic"?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 1,
    explanation: 'O(log n) time complexity increases logarithmically with input size, typical of binary search.'
  },
  {
    questionId: 'tech-009',
    category: 'Technology',
    difficulty: 'hard',
    question: 'Which consensus mechanism was originally introduced by Bitcoin in 2008?',
    options: ['Proof of Stake (PoS)', 'Proof of Authority (PoA)', 'Proof of Work (PoW)', 'Proof of Burn (PoB)'],
    correctIndex: 2,
    explanation: 'Satoshi Nakamoto implemented Proof of Work utilizing SHA-256 hashing to achieve decentralized consensus.'
  },
  {
    questionId: 'tech-010',
    category: 'Technology',
    difficulty: 'easy',
    question: 'Which company developed the Android mobile operating system before it was acquired by Google?',
    options: ['Android Inc.', 'Palm Computing', 'Symbian Ltd.', 'Motorola'],
    correctIndex: 0,
    explanation: 'Android Inc. was founded in Palo Alto in 2003 by Andy Rubin and acquired by Google in 2005.'
  },
  {
    questionId: 'tech-011',
    category: 'Technology',
    difficulty: 'medium',
    question: 'What does "RAM" stand for in computer hardware?',
    options: ['Rapid Access Memory', 'Random Access Memory', 'Read Allocation Module', 'Registry Array Memory'],
    correctIndex: 1,
    explanation: 'RAM allows data items to be read or written in almost the same amount of time irrespective of the physical location of data.'
  },
  {
    questionId: 'tech-012',
    category: 'Technology',
    difficulty: 'hard',
    question: 'Which open-source version control system was created by Linus Torvalds in 2005?',
    options: ['Subversion (SVN)', 'Mercurial', 'Git', 'CVS'],
    correctIndex: 2,
    explanation: 'Linus Torvalds created Git to coordinate development among Linux kernel programmers.'
  },
  {
    questionId: 'tech-013',
    category: 'Technology',
    difficulty: 'easy',
    question: 'What does the abbreviation "AI" commonly stand for in modern computing?',
    options: ['Automated Interface', 'Artificial Intelligence', 'Algorithmic Integration', 'Applied Indexing'],
    correctIndex: 1,
    explanation: 'Artificial Intelligence refers to the simulation of human intelligence processes by machines.'
  },
  {
    questionId: 'tech-014',
    category: 'Technology',
    difficulty: 'medium',
    question: 'Which network protocol is responsible for translating human-readable domain names into IP addresses?',
    options: ['DHCP', 'DNS', 'FTP', 'SNMP'],
    correctIndex: 1,
    explanation: 'The Domain Name System (DNS) maintains directory listings of domain names and translates them to IP addresses.'
  },
  {
    questionId: 'tech-015',
    category: 'Technology',
    difficulty: 'hard',
    question: 'What does "REST" stand for in web API architecture?',
    options: [
      'Representational State Transfer',
      'Remote Execution Standard Transmission',
      'Real-Time Endpoint Socket Technology',
      'Relational Schema Table'
    ],
    correctIndex: 0,
    explanation: 'REST (Representational State Transfer) was defined by Roy Fielding in his 2000 doctoral dissertation.'
  },

  // ==========================================
  // NATURE (15 questions)
  // ==========================================
  {
    questionId: 'nat-001',
    category: 'Nature',
    difficulty: 'easy',
    question: 'Which is the largest living mammal on planet Earth?',
    options: ['African Bush Elephant', 'Blue Whale', 'Colossal Squid', 'Giraffe'],
    correctIndex: 1,
    explanation: 'The Antarctic blue whale can reach lengths of up to 30 meters and weigh up to 190 metric tons.'
  },
  {
    questionId: 'nat-002',
    category: 'Nature',
    difficulty: 'easy',
    question: 'What process do plants use to convert sunlight, water, and carbon dioxide into oxygen and sugars?',
    options: ['Cellular Respiration', 'Transpiration', 'Photosynthesis', 'Fermentation'],
    correctIndex: 2,
    explanation: 'Photosynthesis occurs primarily in chloroplasts containing green chlorophyll pigments.'
  },
  {
    questionId: 'nat-003',
    category: 'Nature',
    difficulty: 'medium',
    question: 'How many hearts does an octopus possess?',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'An octopus has three hearts: two pump blood through the gills, while the third pumps blood through the body.'
  },
  {
    questionId: 'nat-004',
    category: 'Nature',
    difficulty: 'medium',
    question: 'What is the tallest living tree species on Earth?',
    options: ['Douglas Fir', 'Coast Redwood (Sequoia sempervirens)', 'Giant Sequoia', 'Mountain Ash'],
    correctIndex: 1,
    explanation: 'Coast Redwoods are the tallest living trees; Hyperion in California measures over 115.92 meters (380 ft).'
  },
  {
    questionId: 'nat-005',
    category: 'Nature',
    difficulty: 'easy',
    question: 'A group of flamingos is commonly called which of the following terms?',
    options: ['A flock', 'A pride', 'A flamboyance', 'A parliament'],
    correctIndex: 2,
    explanation: 'A gathering of flamingos is charmingly known as a "flamboyance".'
  },
  {
    questionId: 'nat-006',
    category: 'Nature',
    difficulty: 'medium',
    question: 'What is the only mammal capable of sustained, powered flight?',
    options: ['Flying Squirrel', 'Sugar Glider', 'Bat', 'Colugo'],
    correctIndex: 2,
    explanation: 'Bats (order Chiroptera) are the only mammals that possess wings capable of true flapping flight.'
  },
  {
    questionId: 'nat-007',
    category: 'Nature',
    difficulty: 'hard',
    question: 'Which living bird lays the largest egg in proportion to its own body weight?',
    options: ['Ostrich', 'Kiwi', 'Hummingbird', 'Emperor Penguin'],
    correctIndex: 1,
    explanation: 'The female kiwi lays an egg that takes up roughly 20% of its entire body volume.'
  },
  {
    questionId: 'nat-008',
    category: 'Nature',
    difficulty: 'easy',
    question: 'What color is the blood of a healthy human being when it is inside the body?',
    options: ['Blue', 'Purple', 'Bright Red / Dark Red', 'Green'],
    correctIndex: 2,
    explanation: 'Human blood is always red; oxygenated blood is bright red, and deoxygenated blood is darker red.'
  },
  {
    questionId: 'nat-009',
    category: 'Nature',
    difficulty: 'medium',
    question: 'Which animal holds the record for the fastest recorded sprint on land?',
    options: ['Pronghorn', 'Lion', 'Cheetah', 'Springbok'],
    correctIndex: 2,
    explanation: 'Cheetahs can achieve sprint bursts between 95 and 120 km/h (60 to 75 mph).'
  },
  {
    questionId: 'nat-010',
    category: 'Nature',
    difficulty: 'hard',
    question: 'What biological substance forms the outer exoskeleton of insects and crustaceans?',
    options: ['Keratin', 'Cellulose', 'Chitin', 'Collagen'],
    correctIndex: 2,
    explanation: 'Chitin is a tough polysaccharide polymer that forms arthropod shells and fungal cell walls.'
  },
  {
    questionId: 'nat-011',
    category: 'Nature',
    difficulty: 'medium',
    question: 'What type of creature is a Portuguese Man-of-War?',
    options: ['Jellyfish', 'Siphonophore (colonial organism)', 'Anemone', 'Coral reef polyps'],
    correctIndex: 1,
    explanation: 'It is not a true single jellyfish, but a siphonophore composed of specialized individual zooids.'
  },
  {
    questionId: 'nat-012',
    category: 'Nature',
    difficulty: 'easy',
    question: 'Which continent has no native ant species?',
    options: ['Australia', 'Antarctica', 'South America', 'Europe'],
    correctIndex: 1,
    explanation: 'Due to extreme freezing conditions, Antarctica has no native ant colonies.'
  },
  {
    questionId: 'nat-013',
    category: 'Nature',
    difficulty: 'medium',
    question: 'What organ allows fish to detect pressure changes and vibrations in the surrounding water?',
    options: ['Swim bladder', 'Lateral line', 'Operculum', 'Pectoral fin'],
    correctIndex: 1,
    explanation: 'The lateral line system consists of mechanoreceptors (neuromasts) that detect water movement.'
  },
  {
    questionId: 'nat-014',
    category: 'Nature',
    difficulty: 'hard',
    question: 'What is the oldest known living individual non-clonal tree on Earth?',
    options: ['General Sherman', 'Methuselah (Great Basin bristlecone pine)', 'Jōmon Sugi', 'Llangernyw Yew'],
    correctIndex: 1,
    explanation: 'Methuselah in California White Mountains is estimated to be over 4,850 years old.'
  },
  {
    questionId: 'nat-015',
    category: 'Nature',
    difficulty: 'easy',
    question: 'What is the primary food source of wild giant pandas?',
    options: ['Eucalyptus leaves', 'Bamboo', 'Fish', 'Acorns'],
    correctIndex: 1,
    explanation: 'Bamboo makes up over 99% of a wild giant panda daily diet.'
  },

  // ==========================================
  // SPORTS (15 questions)
  // ==========================================
  {
    questionId: 'spo-001',
    category: 'Sports',
    difficulty: 'easy',
    question: 'Which country won the FIFA Men’s World Cup in Qatar in 2022?',
    options: ['France', 'Brazil', 'Argentina', 'Germany'],
    correctIndex: 2,
    explanation: 'Argentina defeated France in an unforgettable penalty shootout after a 3-3 draw in the final.'
  },
  {
    questionId: 'spo-002',
    category: 'Sports',
    difficulty: 'easy',
    question: 'How many players are on the court for one basketball team during regulation play?',
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
    explanation: 'Each basketball team fields 5 players at a time during regulation matches.'
  },
  {
    questionId: 'spo-003',
    category: 'Sports',
    difficulty: 'medium',
    question: 'What is the standard distance of an official marathon race in kilometers?',
    options: ['40.000 km', '42.195 km', '45.500 km', '50.000 km'],
    correctIndex: 1,
    explanation: 'An official marathon is exactly 42.195 km (26 miles and 385 yards), established at the 1908 London Olympics.'
  },
  {
    questionId: 'spo-004',
    category: 'Sports',
    difficulty: 'medium',
    question: 'In tennis, which Grand Slam tournament is played on traditional grass courts?',
    options: ['Australian Open', 'Roland Garros (French Open)', 'Wimbledon', 'US Open'],
    correctIndex: 2,
    explanation: 'Wimbledon Championships in London has been contested on outdoor grass courts since 1877.'
  },
  {
    questionId: 'spo-005',
    category: 'Sports',
    difficulty: 'hard',
    question: 'Who holds the men’s 100-meter sprint world record at 9.58 seconds?',
    options: ['Tyson Gay', 'Yohan Blake', 'Usain Bolt', 'Asafa Powell'],
    correctIndex: 2,
    explanation: 'Usain Bolt set the historic world record of 9.58 seconds at the 2009 World Athletics Championships in Berlin.'
  },
  {
    questionId: 'spo-006',
    category: 'Sports',
    difficulty: 'easy',
    question: 'In bowling, what term describes scoring three consecutive strikes?',
    options: ['A Triple', 'A Turkey', 'A Hat-trick', 'A Treble'],
    correctIndex: 1,
    explanation: 'Bowling three strikes in a row has been called a "turkey" since the late 19th century.'
  },
  {
    questionId: 'spo-007',
    category: 'Sports',
    difficulty: 'medium',
    question: 'Which nation has won the most FIFA Men’s World Cup titles in history (5 titles)?',
    options: ['Italy', 'Germany', 'Brazil', 'Argentina'],
    correctIndex: 2,
    explanation: 'Brazil won the World Cup in 1958, 1962, 1970, 1994, and 2002.'
  },
  {
    questionId: 'spo-008',
    category: 'Sports',
    difficulty: 'hard',
    question: 'In golf, what is the score called when a player completes a hole three strokes under par?',
    options: ['Eagle', 'Albatross (or Double Eagle)', 'Condor', 'Birdie'],
    correctIndex: 1,
    explanation: 'An albatross (double eagle) is 3 under par, such as scoring a 2 on a par 5 hole.'
  },
  {
    questionId: 'spo-009',
    category: 'Sports',
    difficulty: 'easy',
    question: 'How many rings make up the official Olympic symbol?',
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
    explanation: 'The five interlocking rings represent the union of the five populated continents of the world.'
  },
  {
    questionId: 'spo-010',
    category: 'Sports',
    difficulty: 'medium',
    question: 'Which team won the first ever Super Bowl in NFL history in 1967?',
    options: ['Kansas City Chiefs', 'Green Bay Packers', 'Dallas Cowboys', 'Oakland Raiders'],
    correctIndex: 1,
    explanation: 'The Green Bay Packers defeated the Kansas City Chiefs 35–10 in Super Bowl I.'
  },
  {
    questionId: 'spo-011',
    category: 'Sports',
    difficulty: 'medium',
    question: 'What is the diameter of an official basketball hoop rim in inches?',
    options: ['16 inches', '18 inches', '20 inches', '22 inches'],
    correctIndex: 1,
    explanation: 'Official regulation basketball rims have an inside diameter of exactly 18 inches.'
  },
  {
    questionId: 'spo-012',
    category: 'Sports',
    difficulty: 'hard',
    question: 'Which driver has won a record-tying 7 Formula One World Drivers’ Championships alongside Michael Schumacher?',
    options: ['Sebastian Vettel', 'Max Verstappen', 'Lewis Hamilton', 'Fernando Alonso'],
    correctIndex: 2,
    explanation: 'Lewis Hamilton secured his 7th world title in 2020, matching Michael Schumacher record.'
  },
  {
    questionId: 'spo-013',
    category: 'Sports',
    difficulty: 'easy',
    question: 'In soccer, how many minutes is standard regulation time without extra time or stoppage time?',
    options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
    correctIndex: 1,
    explanation: 'A standard association football match consists of two 45-minute halves for 90 total regulation minutes.'
  },
  {
    questionId: 'spo-014',
    category: 'Sports',
    difficulty: 'medium',
    question: 'In cricket, what does "LBW" stand for?',
    options: ['Line Before Wicket', 'Leg Before Wicket', 'Late Batting Warning', 'Low Ball Wide'],
    correctIndex: 1,
    explanation: 'Leg Before Wicket is one of the ten ways a batsman can be dismissed in cricket.'
  },
  {
    questionId: 'spo-015',
    category: 'Sports',
    difficulty: 'easy',
    question: 'In which sport do competitors vie for the Stanley Cup trophy?',
    options: ['Baseball', 'American Football', 'Ice Hockey', 'Cricket'],
    correctIndex: 2,
    explanation: 'The Stanley Cup is the oldest trophy competed for by professional athletes in North America (NHL).'
  },

  // ==========================================
  // GENERAL KNOWLEDGE (15 questions)
  // ==========================================
  {
    questionId: 'gen-001',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'How many days are in a standard leap year in the Gregorian calendar?',
    options: ['364', '365', '366', '367'],
    correctIndex: 2,
    explanation: 'A leap year contains 366 days instead of 365, with February having 29 days.'
  },
  {
    questionId: 'gen-002',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'What is the Roman numeral equivalent for the number 50?',
    options: ['C', 'D', 'L', 'M'],
    correctIndex: 2,
    explanation: 'In Roman numerals, L represents 50, C is 100, D is 500, and M is 1,000.'
  },
  {
    questionId: 'gen-003',
    category: 'General Knowledge',
    difficulty: 'medium',
    question: 'Which author created the legendary consulting detective Sherlock Holmes?',
    options: ['Agatha Christie', 'Arthur Conan Doyle', 'Edgar Allan Poe', 'G. K. Chesterton'],
    correctIndex: 1,
    explanation: 'Sir Arthur Conan Doyle introduced Sherlock Holmes in the 1887 novel "A Study in Scarlet".'
  },
  {
    questionId: 'gen-004',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'What is the color of an emerald gemstone?',
    options: ['Deep Blue', 'Ruby Red', 'Vibrant Green', 'Bright Yellow'],
    correctIndex: 2,
    explanation: 'Emeralds are green beryl crystals colored by trace amounts of chromium and sometimes vanadium.'
  },
  {
    questionId: 'gen-005',
    category: 'General Knowledge',
    difficulty: 'medium',
    question: 'What is the primary currency used in Japan?',
    options: ['Won', 'Yuan', 'Yen', 'Baht'],
    correctIndex: 2,
    explanation: 'The Yen (symbol: ¥, code: JPY) is the official currency of Japan.'
  },
  {
    questionId: 'gen-006',
    category: 'General Knowledge',
    difficulty: 'hard',
    question: 'In nautical terms, what is the opposite of "port" (the left side of a ship)?',
    options: ['Bow', 'Stern', 'Starboard', 'Aft'],
    correctIndex: 2,
    explanation: 'Starboard refers to the right-hand side of a vessel when facing forward towards the bow.'
  },
  {
    questionId: 'gen-007',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'Which language has the highest number of native speakers worldwide?',
    options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
    correctIndex: 2,
    explanation: 'Mandarin Chinese has over 920 million native first-language speakers.'
  },
  {
    questionId: 'gen-008',
    category: 'General Knowledge',
    difficulty: 'medium',
    question: 'Which instrument in a symphony orchestra typically tunes the rest of the orchestra to an "A"?',
    options: ['Flute', 'Oboe', 'First Violin', 'French Horn'],
    correctIndex: 1,
    explanation: 'The oboe has a distinct, penetrating timbre and stable pitch, making it standard for orchestral tuning.'
  },
  {
    questionId: 'gen-009',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'What is the hardest naturally occurring mineral on Mohs hardness scale?',
    options: ['Quartz', 'Topaz', 'Diamond', 'Corundum (Sapphire)'],
    correctIndex: 2,
    explanation: 'Diamond defines the top value of 10 on the Mohs scale of mineral hardness.'
  },
  {
    questionId: 'gen-010',
    category: 'General Knowledge',
    difficulty: 'medium',
    question: 'Which famous artist cut off part of his own left ear in December 1888?',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Salvador Dalí'],
    correctIndex: 1,
    explanation: 'Dutch post-impressionist painter Vincent van Gogh suffered acute mental distress in Arles, France.'
  },
  {
    questionId: 'gen-011',
    category: 'General Knowledge',
    difficulty: 'hard',
    question: 'How many keys are on a standard modern grand piano keyboard?',
    options: ['84', '88', '92', '96'],
    correctIndex: 1,
    explanation: 'A standard modern piano has 88 keys: 52 white keys and 36 black keys (seven octaves plus three notes).'
  },
  {
    questionId: 'gen-012',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'What is the name of the popular toy consisting of interconnected plastic building bricks?',
    options: ['Playmobil', 'LEGO', 'K\'Nex', 'Meccano'],
    correctIndex: 1,
    explanation: 'LEGO was founded in Billund, Denmark, by Ole Kirk Christiansen in 1932.'
  },
  {
    questionId: 'gen-013',
    category: 'General Knowledge',
    difficulty: 'medium',
    question: 'What is the national flower of Japan, celebrated every spring with blossom festivals?',
    options: ['Lotus', 'Chrysanthemum', 'Cherry Blossom (Sakura)', 'Orchid'],
    correctIndex: 2,
    explanation: 'The cherry blossom (sakura) is deeply woven into Japanese culture and signifies spring renewals.'
  },
  {
    questionId: 'gen-014',
    category: 'General Knowledge',
    difficulty: 'hard',
    question: 'What is the name of the mathematical symbol "∞" denoting infinity?',
    options: ['Lemniscate', 'Möbius', 'Torus', 'Tesseract'],
    correctIndex: 0,
    explanation: 'The infinity symbol is called a lemniscate, from the Latin word meaning ribbon.'
  },
  {
    questionId: 'gen-015',
    category: 'General Knowledge',
    difficulty: 'easy',
    question: 'Which spice is recognized as the most expensive spice in the world by weight?',
    options: ['Vanilla', 'Cardamom', 'Saffron', 'Cinnamon'],
    correctIndex: 2,
    explanation: 'Saffron is derived from the delicate stigmas of Crocus sativus flowers, requiring thousands of hand-picked flowers per pound.'
  }
];
