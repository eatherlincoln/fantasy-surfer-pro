import { Surfer, Tier } from './types';

export const FULL_MOCK_SURFERS: Surfer[] = [
    // --- MEN (Based on Spreadsheet) ---
    // Tier A
    { id: 'yago-dora', name: 'Yago Dora', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 27, value: 11.0, tier: Tier.A, image: '/images/surfers/yago-dora.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'ethan-ewing', name: 'Ethan Ewing', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 25, value: 10.0, tier: Tier.A, image: '/images/surfers/ethan-ewing.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'griffin-colapinto', name: 'Griffin Colapinto', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 25, value: 10.0, tier: Tier.A, image: '/images/surfers/griffin-colapinto.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'jack-robinson', name: 'Jack Robinson', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 26, value: 10.0, tier: Tier.A, image: '/images/surfers/jack-robinson.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'italo-ferreira', name: 'Italo Ferriera', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 29, value: 9.5, tier: Tier.A, image: '/images/surfers/italo-ferreira.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'jordy-smith', name: 'Jordy Smith', country: 'South Africa', flag: '🇿🇦', stance: 'Regular', age: 36, value: 9.5, tier: Tier.A, image: '/images/surfers/jordy-smith.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'filipe-toledo', name: 'Filipe Toledo', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 29, value: 9.0, tier: Tier.A, image: '/images/surfers/filipe-toledo.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'kanoa-igarashi', name: 'Kanoa Igarashi', country: 'Japan', flag: '🇯🇵', stance: 'Regular', age: 26, value: 9.0, tier: Tier.A, image: '/images/surfers/kanoa-igarashi.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'connor-oleary', name: "Connor O'Leary", country: 'Japan', flag: '🇯🇵', stance: 'Goofy', age: 30, value: 8.0, tier: Tier.A, image: '/images/surfers/connor-oleary.png', points: 0, gender: 'Male', status: 'Waiting' },

    // Tier B
    { id: 'gabriel-medina', name: 'Gabriel Medina', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 30, value: 8.0, tier: Tier.B, image: '/images/surfers/gabriel-medina.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'barron-mamiya', name: 'Barron Mamiya', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 24, value: 7.0, tier: Tier.B, image: '/images/surfers/barron-mamiya.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'leo-fioravanti', name: 'Leonardo Fioravanti', country: 'Italy', flag: '🇮🇹', stance: 'Regular', age: 26, value: 7.0, tier: Tier.B, image: '/images/surfers/leo-fioravanti.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'joao-chianca', name: 'Joao Chianca', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 23, value: 6.0, tier: Tier.B, image: '/images/surfers/joao-chianca.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'liam-obrien', name: "Liam O'Brien", country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 25, value: 6.0, tier: Tier.B, image: '/images/surfers/liam-obrien.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'joel-vaughan', name: 'Joel Vaughan', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 20, value: 5.5, tier: Tier.B, image: '/images/surfers/joel-vaughan.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'cole-houshmand', name: 'Cole Houshmand', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 23, value: 5.0, tier: Tier.B, image: '/images/surfers/cole-houshmand.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'jake-marshall', name: 'Jake Marshall', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 25, value: 5.0, tier: Tier.B, image: '/images/surfers/jake-marshall.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'crosby-colapinto', name: 'Crosby Colapinto', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 22, value: 4.5, tier: Tier.B, image: '/images/surfers/crosby-colapinto.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'matt-mcgillivray', name: 'Matthew McGillivray', country: 'South Africa', flag: '🇿🇦', stance: 'Regular', age: 27, value: 4.5, tier: Tier.B, image: '/images/surfers/matt-mcgillivray.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'miguel-pupo', name: 'Miguel Pupo', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 32, value: 4.5, tier: Tier.B, image: '/images/surfers/miguel-pupo.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'ryan-callinan', name: 'Ryan Callinan', country: 'Australia', flag: '🇦🇺', stance: 'Goofy', age: 31, value: 4.5, tier: Tier.B, image: '/images/surfers/ryan-callinan.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'samuel-pupo', name: 'Samuel Pupo', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 23, value: 4.5, tier: Tier.B, image: '/images/surfers/samuel-pupo.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'imaikalani-devault', name: 'Imaikalani deVault', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 26, value: 4.0, tier: Tier.B, image: '/images/surfers/imaikalani-devault.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'rio-waida', name: 'Rio Waida', country: 'Indonesia', flag: '🇮🇩', stance: 'Regular', age: 24, value: 4.0, tier: Tier.B, image: '/images/surfers/rio-waida.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'seth-moniz', name: 'Seth Moniz', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 26, value: 3.5, tier: Tier.B, image: '/images/surfers/seth-moniz.png', points: 0, gender: 'Male', status: 'Waiting' },

    // Tier C
    { id: 'jackson-bunch', name: 'Jackson Bunch', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 20, value: 3.0, tier: Tier.C, image: '/images/surfers/jackson-bunch.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'marco-mignot', name: 'Marco Mignot', country: 'France', flag: '🇫🇷', stance: 'Regular', age: 23, value: 3.0, tier: Tier.C, image: '/images/surfers/marco-mignot.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'alan-cleland', name: 'Alan Cleland', country: 'Mexico', flag: '🇲🇽', stance: 'Regular', age: 21, value: 2.0, tier: Tier.C, image: '/images/surfers/alan-cleland.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'ian-gentil', name: 'Ian Gentil', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 28, value: 2.0, tier: Tier.C, image: '/images/surfers/ian-gentil.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'ramzi-boukhiam', name: 'Ramzi Boukhiam', country: 'Morrocco', flag: '🇲🇦', stance: 'Goofy', age: 30, value: 2.0, tier: Tier.C, image: '/images/surfers/ramzi-boukhiam.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'george-pittar', name: 'George Pittar', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 21, value: 1.5, tier: Tier.C, image: '/images/surfers/george-pittar.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'alejo-muniz', name: 'Alejo Muniz', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 34, value: 1.0, tier: Tier.C, image: '/images/surfers/alejo-muniz.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'deivid-silva', name: 'Deivid Silva', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 29, value: 1.0, tier: Tier.C, image: '/images/surfers/deivid-silva.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'ian-gouveia', name: 'Ian Gouveia', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 31, value: 1.0, tier: Tier.C, image: '/images/surfers/ian-gouveia.png', points: 0, gender: 'Male', status: 'Waiting' },
    { id: 'edgard-groggia', name: 'Edgard Groggia', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 27, value: 0.5, tier: Tier.C, image: '/images/surfers/edgard-groggia.png', points: 0, gender: 'Male', status: 'Waiting' },

    // --- WOMEN ---
    // Tier A
    { id: 'molly-picklum', name: 'Molly Picklum', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 21, value: 11.0, tier: Tier.A, image: 'https://ui-avatars.com/api/?name=Molly+Picklum&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'caitlin-simmers', name: 'Caitlin Simmers', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 18, value: 10.0, tier: Tier.A, image: 'https://ui-avatars.com/api/?name=Caitlin+Simmers&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'caroline-marks', name: 'Caroline Marks', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 22, value: 9.5, tier: Tier.A, image: 'https://ui-avatars.com/api/?name=Caroline+Marks&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'betty-lou-sakura-johnson', name: 'Betty Lou Sakura Johnson', country: 'Hawaii', flag: '🇺🇸', stance: 'Regular', age: 19, value: 8.0, tier: Tier.A, image: 'https://ui-avatars.com/api/?name=Betty+Lou+Sakura+Johnson&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },

    // Tier B
    { id: 'gabriela-bryan', name: 'Gabriela Bryan', country: 'Hawaii', flag: '🇺🇸', stance: 'Regular', age: 22, value: 6.5, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Gabriela+Bryan&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'tyler-wright', name: 'Tyler Wright', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 29, value: 6.5, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Tyler+Wright&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'erin-brooks', name: 'Erin Brooks', country: 'Canada', flag: '🇨🇦', stance: 'Goofy', age: 17, value: 7.0, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Erin+Brooks&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'brisa-hennessy', name: 'Brisa Hennessy', country: 'Costa Rica', flag: '🇨🇷', stance: 'Regular', age: 24, value: 5.0, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Brisa+Hennessy&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'lakey-peterson', name: 'Lakey Peterson', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 29, value: 5.0, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Lakey+Peterson&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'luana-silva', name: 'Luana Silva', country: 'Brazil', flag: '🇧🇷', stance: 'Regular', age: 19, value: 4.5, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Luana+Silva&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'sawyer-lindblad', name: 'Sawyer Lindblad', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 18, value: 4.0, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Sawyer+Lindblad&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'isabella-nichols', name: 'Isabella Nichols', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 26, value: 4.0, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Isabella+Nichols&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'sally-fitzgibbons', name: 'Sally Fitzgibbons', country: 'Australia', flag: '🇦🇺', stance: 'Regular', age: 33, value: 4.5, tier: Tier.B, image: 'https://ui-avatars.com/api/?name=Sally+Fitzgibbons&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },

    // Tier C
    { id: 'johanne-defay', name: 'Johanne Defay', country: 'France', flag: '🇫🇷', stance: 'Regular', age: 30, value: 1.5, tier: Tier.C, image: 'https://ui-avatars.com/api/?name=Johanne+Defay&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'tatiana-weston-webb', name: 'Tatiana Weston-Webb', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', age: 27, value: 1.5, tier: Tier.C, image: 'https://ui-avatars.com/api/?name=Tatiana+Weston-Webb&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'vahine-fierro', name: 'Vahine Fierro', country: 'France', flag: '🇫🇷', stance: 'Goofy', age: 24, value: 1.0, tier: Tier.C, image: 'https://ui-avatars.com/api/?name=Vahine+Fierro&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
    { id: 'nadia-erostarbe', name: 'Nadia Erostarbe', country: 'Basque Country', flag: '🇪🇸', stance: 'Goofy', age: 23, value: 0.5, tier: Tier.C, image: 'https://ui-avatars.com/api/?name=Nadia+Erostarbe&background=random&size=200', points: 0, gender: 'Female', status: 'Waiting' },
];
