import subprocess
import os

os.makedirs('public/assets/food_crops', exist_ok=True)

# Grid definitions with precise coordinates
collages = [
    {
        'region': 'karnataka',
        'file': 'public/assets/aistudio/image_775cff75.png',
        'x_spans': [
            (5, 180),
            (191, 178),
            (374, 184),
            (564, 185),
            (754, 172)
        ],
        'y_spans': [
            (3, 144),
            (153, 140),
            (298, 138),
            (441, 146)
        ],
        'grid': [
            ['ragi_mudde', 'bisi_bele_bath', 'akki_roti', 'davangere_benne_dosa', 'neer_dosa'],
            ['jolada_roti', 'ennegai', 'bassaru', 'hurali_kalu_saaru', 'chitranna'],
            ['mosaru_anna', 'rave_idli', 'sabsige_soppu_palya', 'heerekayi_palya', 'majjige_huli'],
            ['hesaru_bele_kosambari', 'maddur_vada', 'mysore_pak', 'gasagase_payasa', 'shenga_chutney_pudi']
        ]
    },
    {
        'region': 'tamilnadu',
        'file': 'public/assets/aistudio/image_2c74e342.png',
        'x_spans': [
            (8, 151),
            (162, 150),
            (315, 150),
            (468, 150),
            (621, 150),
            (774, 150)
        ],
        'y_spans': [
            (49, 128),
            (181, 130),
            (315, 130),
            (448, 142)
        ],
        'grid': [
            ['idli', 'dosa', 'ven_pongal', 'rava_upma', 'kuzhi_paniyaram', 'appam'],
            ['idiyappam', 'pidi_kozhukattai', 'elumichai_sadam', 'puliyodarai', 'thayir_sadam', 'sambar_sadam'],
            ['rasam', 'mor_kuzhambu', 'kootu', 'poriyal', 'sambar', 'vathal_kuzhambu'],
            ['chettinad_vegetable_curry', 'filter_coffee', 'semya_payasam', 'adhirasam', 'murukku', 'sundal']
        ]
    },
    {
        'region': 'kerala',
        'file': 'public/assets/aistudio/image_d4cf8931.png',
        'x_spans': [
            (8, 150),
            (161, 150),
            (314, 150),
            (467, 149),
            (620, 150),
            (773, 150)
        ],
        'y_spans': [
            (52, 128),
            (185, 127),
            (315, 127),
            (446, 142)
        ],
        'grid': [
            ['puttu', 'appam', 'idiyappam', 'kerala_parotta', 'pazhampori', 'banana_chips'],
            ['kadala_curry', 'avial', 'olan', 'erissery', 'kalan', 'thoran'],
            ['pachadi', 'kichadi', 'sambar', 'rasam', 'prawn_curry', 'fish_curry'],
            ['karimeen_pollichathu', 'malabar_biryani', 'pathiri', 'unniyappam', 'palada_payasam', 'ada_pradhaman']
        ]
    },
    {
        'region': 'andhra',
        'file': 'public/assets/aistudio/image_719f4072.png',
        'x_spans': [
            (6, 149),
            (159, 153),
            (316, 147),
            (468, 148),
            (621, 150),
            (775, 148)
        ],
        'y_spans': [
            (52, 125),
            (181, 128),
            (313, 128),
            (444, 140)
        ],
        'grid': [
            ['pulihora', 'pesarattu', 'upma', 'bobbatlu', 'gongura_pachadi', 'tomato_pappu'],
            ['pappu_charu', 'gutti_vankaya', 'chicken_curry', 'kodi_pulao', 'royyala_iguru', 'chepala_pulusu'],
            ['ragi_sangati', 'sarva_pindi', 'punugulu', 'mirchi_bajji', 'ulavacharu', 'pachhi_pulusu'],
            ['avakaya', 'bendakaya_fry', 'munagakaya_pappu', 'pootharekulu', 'ariselu', 'bellam_paramannam']
        ]
    },
    {
        'region': 'puducherry',
        'file': 'public/assets/aistudio/image_161671cf.png',
        'x_spans': [
            (8, 151),
            (163, 150),
            (316, 150),
            (470, 150),
            (623, 151),
            (777, 151)
        ],
        'y_spans': [
            (68, 125),
            (197, 126),
            (325, 126),
            (454, 137)
        ],
        'grid': [
            ['idli', 'dosa', 'appam', 'idiyappam', 'pongal', 'vegetable_stew'],
            ['fish_curry', 'prawn_curry', 'crab_masala', 'chicken_curry', 'mutton_curry', 'biryani'],
            ['lemon_rice', 'coconut_rice', 'puliyodarai', 'thayir_sadam', 'medu_vada', 'kootu'],
            ['aviyal', 'ratatouille', 'baguette_sandwich', 'caramel_pudding', 'paniyaram', 'semiya_payasam']
        ]
    }
]

total_cropped = 0
for col_info in collages:
    region = col_info['region']
    src_file = col_info['file']
    x_spans = col_info['x_spans']
    y_spans = col_info['y_spans']
    grid = col_info['grid']
    
    print(f"Processing region {region}...")
    for r_idx, row in enumerate(grid):
        y, h = y_spans[r_idx]
        for c_idx, slug in enumerate(row):
            x, w = x_spans[c_idx]
            out_filename = f"public/assets/food_crops/{region}_{slug}.png"
            crop_arg = f"{w}x{h}+{x}+{y}"
            subprocess.run(['convert', src_file, '-crop', crop_arg, out_filename], check=True)
            total_cropped += 1

print(f"Successfully cropped all {total_cropped} food items into public/assets/food_crops/")
