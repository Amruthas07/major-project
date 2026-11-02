import json

# Complete structured definition of all 116 cropped regional dishes
dishes = [
    # KARNATAKA (20 dishes)
    {
        "key": "karnataka_ragi_mudde",
        "canonicalIds": ["ragi_mudde", "ragi_balls", "karnataka_02"],
        "exactDishName": "Ragi Mudde (Finger Millet Ball)",
        "aliases": ["ragi mudde", "ragi ball", "ragi balls", "finger millet ball", "ragi kali", "ragimudde"],
        "state": "Karnataka",
        "cropFile": "karnataka_ragi_mudde.png",
        "isVegetarian": True,
        "description": "Traditional steamed finger millet ball packed with calcium, dietary fiber, and slow-release complex carbohydrates for maternal bone and metabolic health."
    },
    {
        "key": "karnataka_bisi_bele_bath",
        "canonicalIds": ["bisi_bele_bath", "karnataka_01", "bisibelebath"],
        "exactDishName": "Bisi Bele Bath",
        "aliases": ["bisi bele bath", "bisibelebath", "bisi bele bhath", "hot lentil rice", "lentil rice with veg"],
        "state": "Karnataka",
        "cropFile": "karnataka_bisi_bele_bath.png",
        "isVegetarian": True,
        "description": "Nutritious one-pot Karnataka meal combining rice, toor dal, seasonal vegetables, tamarind, and aromatic spices rich in protein and micronutrients."
    },
    {
        "key": "karnataka_akki_roti",
        "canonicalIds": ["akki_roti", "akki_rotti"],
        "exactDishName": "Akki Roti",
        "aliases": ["akki roti", "akki rotti", "rice flour flatbread", "sabbakki akki roti"],
        "state": "Karnataka",
        "cropFile": "karnataka_akki_roti.png",
        "isVegetarian": True,
        "description": "Pan-roasted rice flour flatbread loaded with fresh dill (sabsige soppu), grated carrots, onions, and cumin for digestion."
    },
    {
        "key": "karnataka_davangere_benne_dosa",
        "canonicalIds": ["davangere_benne_dosa", "benne_dosa"],
        "exactDishName": "Davangere Benne Dosa",
        "aliases": ["davangere benne dosa", "benne dosa", "davangere dosa", "butter dosa"],
        "state": "Karnataka",
        "cropFile": "karnataka_davangere_benne_dosa.png",
        "isVegetarian": True,
        "description": "Crisp yet fluffy fermented rice and urad dal crepe cooked with fresh farm butter, served with aloo palya and coconut chutney."
    },
    {
        "key": "karnataka_neer_dosa",
        "canonicalIds": ["neer_dosa", "neerdosa"],
        "exactDishName": "Neer Dosa",
        "aliases": ["neer dosa", "neerdosa", "mangalore neer dosa", "water dosa"],
        "state": "Karnataka",
        "cropFile": "karnataka_neer_dosa.png",
        "isVegetarian": True,
        "description": "Light, delicate coastal Karnataka rice crepe that is soft, easy to digest, and gentle on maternal digestion."
    },
    {
        "key": "karnataka_jolada_roti",
        "canonicalIds": ["jolada_roti", "jolada_rotti", "jowar_roti", "jonna_roti"],
        "exactDishName": "Jolada Roti",
        "aliases": ["jolada roti", "jolada rotti", "jowar roti", "jonna roti", "sorghum flatbread"],
        "state": "Karnataka",
        "cropFile": "karnataka_jolada_roti.png",
        "isVegetarian": True,
        "description": "Unleavened sorghum flour flatbread typical of North Karnataka, rich in dietary fiber, iron, and minerals."
    },
    {
        "key": "karnataka_ennegai",
        "canonicalIds": ["ennegai", "badanekayi_ennegai"],
        "exactDishName": "Ennegai (Stuffed Brinjal Curry)",
        "aliases": ["ennegai", "stuffed brinjal curry", "badanekayi ennegai", "north karnataka ennegai"],
        "state": "Karnataka",
        "cropFile": "karnataka_ennegai.png",
        "isVegetarian": True,
        "description": "Tender small brinjals stuffed with roasted peanut, sesame, and spice masala, offering healthy fats and minerals."
    },
    {
        "key": "karnataka_bassaru",
        "canonicalIds": ["bassaru", "bas_saaru"],
        "exactDishName": "Bassaru",
        "aliases": ["bassaru", "bas saaru", "greens lentil broth", "soppina bassaru"],
        "state": "Karnataka",
        "cropFile": "karnataka_bassaru.png",
        "isVegetarian": True,
        "description": "Traditional South Karnataka clear strained broth cooked from lentils and fresh green leafy vegetables."
    },
    {
        "key": "karnataka_hurali_kalu_saaru",
        "canonicalIds": ["hurali_kalu_saaru", "horsegram_saaru"],
        "exactDishName": "Hurali Kalu Saaru",
        "aliases": ["hurali kalu saaru", "horse gram saaru", "horsegram soup", "huruli saaru"],
        "state": "Karnataka",
        "cropFile": "karnataka_hurali_kalu_saaru.png",
        "isVegetarian": True,
        "description": "Protein-rich horse gram curry packed with iron, calcium, and polyphenols, ideal for nourishing blood."
    },
    {
        "key": "karnataka_chitranna",
        "canonicalIds": ["chitranna", "lemon_rice", "karnataka_chitranna"],
        "exactDishName": "Chitranna",
        "aliases": ["chitranna", "lemon rice", "nimbehannu chitranna", "lemon peanut rice"],
        "state": "Karnataka",
        "cropFile": "karnataka_chitranna.png",
        "isVegetarian": True,
        "description": "Fragrant tempered rice flavored with fresh lemon juice, mustard seeds, curry leaves, turmeric, and crunchy peanuts for protein."
    },
    {
        "key": "karnataka_mosaru_anna",
        "canonicalIds": ["mosaru_anna", "curd_rice", "karnataka_mosaru_anna"],
        "exactDishName": "Mosaru Anna",
        "aliases": ["mosaru anna", "curd rice", "thayir sadam", "daddojanam", "tempered curd rice"],
        "state": "Karnataka",
        "cropFile": "karnataka_mosaru_anna.png",
        "isVegetarian": True,
        "description": "Cooling probiotic homemade curd mixed with soft cooked rice and tempered with ginger, green chilies, and curry leaves."
    },
    {
        "key": "karnataka_rave_idli",
        "canonicalIds": ["rave_idli", "rava_idli", "karnataka_rave_idli"],
        "exactDishName": "Rave Idli",
        "aliases": ["rave idli", "rava idli", "semolina idli", "suji idli"],
        "state": "Karnataka",
        "cropFile": "karnataka_rave_idli.png",
        "isVegetarian": True,
        "description": "Steamed semolina cakes spiced with mustard seeds, ginger, curry leaves, cashews, and grated carrots."
    },
    {
        "key": "karnataka_sabsige_soppu_palya",
        "canonicalIds": ["sabsige_soppu_palya", "dill_leaves_stirfry"],
        "exactDishName": "Sabsige Soppu Palya",
        "aliases": ["sabsige soppu palya", "dill leaves fry", "sabsige palya", "dill leaves stirfry"],
        "state": "Karnataka",
        "cropFile": "karnataka_sabsige_soppu_palya.png",
        "isVegetarian": True,
        "description": "Nutrient-dense fresh dill greens sautéed with yellow moong dal and freshly grated coconut, providing high folate and iron."
    },
    {
        "key": "karnataka_heerekayi_palya",
        "canonicalIds": ["heerekayi_palya", "ridgegourd_fry"],
        "exactDishName": "Heerekayi Palya",
        "aliases": ["heerekayi palya", "ridge gourd fry", "ridge gourd curry", "hirekayi palya"],
        "state": "Karnataka",
        "cropFile": "karnataka_heerekayi_palya.png",
        "isVegetarian": True,
        "description": "Gentle, water-rich ridge gourd sautéed with mild spices and grated coconut, hydrating and very easy on digestion."
    },
    {
        "key": "karnataka_majjige_huli",
        "canonicalIds": ["majjige_huli", "mor_kuzhambu_karnataka"],
        "exactDishName": "Majjige Huli",
        "aliases": ["majjige huli", "buttermilk stew", "ash gourd majjige huli"],
        "state": "Karnataka",
        "cropFile": "karnataka_majjige_huli.png",
        "isVegetarian": True,
        "description": "Wholesome buttermilk and coconut gravy stewed with ash gourd or cucumber, probiotic and digestive."
    },
    {
        "key": "karnataka_hesaru_bele_kosambari",
        "canonicalIds": ["hesaru_bele_kosambari", "kosambari"],
        "exactDishName": "Hesaru Bele Kosambari",
        "aliases": ["hesaru bele kosambari", "kosambari", "moong dal salad", "hesarubele kosambari"],
        "state": "Karnataka",
        "cropFile": "karnataka_hesaru_bele_kosambari.png",
        "isVegetarian": True,
        "description": "Refreshing raw soaked moong dal salad with cucumber, grated carrots, lemon juice, and fresh coconut tempering."
    },
    {
        "key": "karnataka_maddur_vada",
        "canonicalIds": ["maddur_vada", "maddur_vade"],
        "exactDishName": "Maddur Vada",
        "aliases": ["maddur vada", "maddur vade", "crispy onion vada"],
        "state": "Karnataka",
        "cropFile": "karnataka_maddur_vada.png",
        "isVegetarian": True,
        "description": "Crispy savory snack from Maddur town made with rice flour, semolina, maida, sliced onions, and curry leaves."
    },
    {
        "key": "karnataka_mysore_pak",
        "canonicalIds": ["mysore_pak", "karnataka_mysore_pak"],
        "exactDishName": "Mysore Pak",
        "aliases": ["mysore pak", "mysorepak", "ghee mysore pak"],
        "state": "Karnataka",
        "cropFile": "karnataka_mysore_pak.png",
        "isVegetarian": True,
        "description": "Rich traditional Karnataka royal confection made from roasted gram flour (besan), pure cow ghee, and sugar."
    },
    {
        "key": "karnataka_gasagase_payasa",
        "canonicalIds": ["gasagase_payasa", "poppy_seeds_kheer"],
        "exactDishName": "Gasagase Payasa",
        "aliases": ["gasagase payasa", "poppy seeds kheer", "khas khas payasam", "gasagase payasam"],
        "state": "Karnataka",
        "cropFile": "karnataka_gasagase_payasa.png",
        "isVegetarian": True,
        "description": "Soothing traditional Karnataka dessert made with white poppy seeds, coconut milk, and jaggery, known for sleep and relaxation."
    },
    {
        "key": "karnataka_shenga_chutney_pudi",
        "canonicalIds": ["shenga_chutney_pudi", "peanut_chutney_powder"],
        "exactDishName": "Shenga Chutney Pudi",
        "aliases": ["shenga chutney pudi", "peanut chutney powder", "shenga pudi", "groundnut chutney powder"],
        "state": "Karnataka",
        "cropFile": "karnataka_shenga_chutney_pudi.png",
        "isVegetarian": True,
        "description": "Dry roasted peanut chutney powder with garlic, cumin, and red chili, providing plant-based protein and zinc."
    },

    # TAMIL NADU (24 dishes)
    {
        "key": "tamilnadu_idli",
        "canonicalIds": ["idli", "idli_sambar", "tamilnadu_01"],
        "exactDishName": "Idli",
        "aliases": ["idli", "steamed idli", "kancheepuram idli", "idly"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_idli.png",
        "isVegetarian": True,
        "description": "Naturally fermented and steamed rice and black gram patties, gentle on maternal digestion and rich in bioavailable vitamins."
    },
    {
        "key": "tamilnadu_dosa",
        "canonicalIds": ["dosa", "plain_dosa", "crisp_dosa"],
        "exactDishName": "Dosa",
        "aliases": ["dosa", "dosai", "crisp dosa", "sada dosa"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_dosa.png",
        "isVegetarian": True,
        "description": "Golden-brown crisp fermented crepe made from rice and urad dal batter, paired with coconut chutney and lentil sambar."
    },
    {
        "key": "tamilnadu_ven_pongal",
        "canonicalIds": ["ven_pongal", "khara_pongal", "pongal"],
        "exactDishName": "Ven Pongal",
        "aliases": ["ven pongal", "khara pongal", "ghee pongal", "pongal"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_ven_pongal.png",
        "isVegetarian": True,
        "description": "Warm, comforting moong dal and rice porridge tempered with crushed black pepper, cumin seeds, fresh ginger, and cashews in ghee."
    },
    {
        "key": "tamilnadu_rava_upma",
        "canonicalIds": ["rava_upma", "upma", "sooji_upma"],
        "exactDishName": "Rava Upma",
        "aliases": ["rava upma", "upma", "sooji upma", "vegetable upma"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_rava_upma.png",
        "isVegetarian": True,
        "description": "Roasted wheat semolina cooked with mustard seeds, curry leaves, ginger, green chilies, and vegetables."
    },
    {
        "key": "tamilnadu_kuzhi_paniyaram",
        "canonicalIds": ["kuzhi_paniyaram", "paniyaram", "paddu"],
        "exactDishName": "Kuzhi Paniyaram",
        "aliases": ["kuzhi paniyaram", "paniyaram", "paddu", "appe", "kara paniyaram"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_kuzhi_paniyaram.png",
        "isVegetarian": True,
        "description": "Crisp-edged, fluffy dumpling balls pan-cooked in a special cast iron mould from fermented batter with onions and mustard seeds."
    },
    {
        "key": "tamilnadu_appam",
        "canonicalIds": ["appam", "tamilnadu_appam", "palappam"],
        "exactDishName": "Appam",
        "aliases": ["appam", "palappam", "hoppers", "vellayappam"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_appam.png",
        "isVegetarian": True,
        "description": "Bowl-shaped fermented rice batter pancake with a soft spongy center and crispy lace-like edges, served with coconut milk."
    },
    {
        "key": "tamilnadu_idiyappam",
        "canonicalIds": ["idiyappam", "string_hoppers", "sevai"],
        "exactDishName": "Idiyappam",
        "aliases": ["idiyappam", "string hoppers", "sevai", "noolputtu"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_idiyappam.png",
        "isVegetarian": True,
        "description": "Delicate steamed rice noodles pressed into nests, easily digestible and perfect with mild vegetable stew."
    },
    {
        "key": "tamilnadu_pidi_kozhukattai",
        "canonicalIds": ["pidi_kozhukattai", "kozhukattai"],
        "exactDishName": "Pidi Kozhukattai",
        "aliases": ["pidi kozhukattai", "kozhukattai", "kara kozhukattai", "steamed rice dumplings"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_pidi_kozhukattai.png",
        "isVegetarian": True,
        "description": "Hand-pressed steamed rice dumplings tempered with mustard, urad dal, curry leaves, and grated coconut."
    },
    {
        "key": "tamilnadu_elumichai_sadam",
        "canonicalIds": ["elumichai_sadam", "lemon_rice_tamilnadu"],
        "exactDishName": "Elumichai Sadam",
        "aliases": ["elumichai sadam", "lemon rice", "elamichai sadham"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_elumichai_sadam.png",
        "isVegetarian": True,
        "description": "Tangy lemon rice seasoned with turmeric, ginger, green chilies, curry leaves, and crunchy roasted lentils."
    },
    {
        "key": "tamilnadu_puliyodarai",
        "canonicalIds": ["puliyodarai", "tamarind_rice", "puliyogare"],
        "exactDishName": "Puliyodarai",
        "aliases": ["puliyodarai", "puliyogare", "tamarind rice", "puli sadam"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_puliyodarai.png",
        "isVegetarian": True,
        "description": "Traditional temple-style tamarind rice simmered with spiced sesame-fenugreek paste and peanuts."
    },
    {
        "key": "tamilnadu_thayir_sadam",
        "canonicalIds": ["thayir_sadam", "curd_rice_tamilnadu"],
        "exactDishName": "Thayir Sadam",
        "aliases": ["thayir sadam", "thayir sadham", "curd rice", "yogurt rice"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_thayir_sadam.png",
        "isVegetarian": True,
        "description": "Creamy homemade yogurt rice tempered with mustard, grated ginger, curry leaves, and fresh pomegranate or grapes."
    },
    {
        "key": "tamilnadu_sambar_sadam",
        "canonicalIds": ["sambar_sadam", "sambar_rice"],
        "exactDishName": "Sambar Sadam",
        "aliases": ["sambar sadam", "sambar sadham", "sambar rice"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_sambar_sadam.png",
        "isVegetarian": True,
        "description": "Wholesome one-pot rice and toor dal preparation simmered with mixed country vegetables and freshly ground sambar masala."
    },
    {
        "key": "tamilnadu_rasam",
        "canonicalIds": ["rasam", "tamil_rasam", "tomato_rasam"],
        "exactDishName": "Rasam",
        "aliases": ["rasam", "tomato rasam", "pepper rasam", "poondu rasam"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_rasam.png",
        "isVegetarian": True,
        "description": "Digestive, aromatic tamarind and tomato broth infused with crushed black pepper, cumin, garlic, and fresh coriander."
    },
    {
        "key": "tamilnadu_mor_kuzhambu",
        "canonicalIds": ["mor_kuzhambu", "moru_kuzhambu"],
        "exactDishName": "Mor Kuzhambu",
        "aliases": ["mor kuzhambu", "moru kuzhambu", "mor kulambu", "curd curry"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_mor_kuzhambu.png",
        "isVegetarian": True,
        "description": "Mild, comforting yogurt gravy ground with coconut, cumin seeds, and green chilies, simmered with ash gourd or okra."
    },
    {
        "key": "tamilnadu_kootu",
        "canonicalIds": ["kootu", "poricha_kootu"],
        "exactDishName": "Kootu",
        "aliases": ["kootu", "poricha kootu", "vegetable kootu", "dal kootu"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_kootu.png",
        "isVegetarian": True,
        "description": "Semi-solid comforting stew of yellow moong dal and bottle gourd or snake gourd with coconut-cumin paste."
    },
    {
        "key": "tamilnadu_poriyal",
        "canonicalIds": ["poriyal", "vegetable_poriyal", "beans_poriyal"],
        "exactDishName": "Poriyal",
        "aliases": ["poriyal", "beans poriyal", "vegetable poriyal", "carrot poriyal"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_poriyal.png",
        "isVegetarian": True,
        "description": "Crisp stir-fried vegetables tempered with mustard seeds, urad dal, curry leaves, and tossed with fresh grated coconut."
    },
    {
        "key": "tamilnadu_sambar",
        "canonicalIds": ["sambar", "drumstick_sambar", "tamil_sambar"],
        "exactDishName": "Sambar",
        "aliases": ["sambar", "drumstick sambar", "murungakkai sambar", "madras sambar"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_sambar.png",
        "isVegetarian": True,
        "description": "Rich lentil stew made with protein-dense toor dal, drumsticks, shallots, tamarind, and aromatic spice blend."
    },
    {
        "key": "tamilnadu_vathal_kuzhambu",
        "canonicalIds": ["vathal_kuzhambu", "vatral_kuzhambu"],
        "exactDishName": "Vathal Kuzhambu",
        "aliases": ["vathal kuzhambu", "vatral kuzhambu", "manathakkali vatha kuzhambu", "sundakkai vathal kuzhambu"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_vathal_kuzhambu.png",
        "isVegetarian": True,
        "description": "Tangy and pungent tamarind gravy cooked with sun-dried turkey berry (sundakkai) or black nightshade (manathakkali) berries."
    },
    {
        "key": "tamilnadu_chettinad_vegetable_curry",
        "canonicalIds": ["chettinad_vegetable_curry", "chettinad_veg_curry"],
        "exactDishName": "Chettinad Vegetable Curry",
        "aliases": ["chettinad vegetable curry", "chettinad veg curry", "chettinad kurma"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_chettinad_vegetable_curry.png",
        "isVegetarian": True,
        "description": "Spicy, highly aromatic vegetable curry flavored with freshly roasted star anise, kalpasi, fennel, and coconut."
    },
    {
        "key": "tamilnadu_filter_coffee",
        "canonicalIds": ["filter_coffee", "madras_filter_coffee"],
        "exactDishName": "Filter Coffee",
        "aliases": ["filter coffee", "madras filter coffee", "kappi", "filter kaapi"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_filter_coffee.png",
        "isVegetarian": True,
        "description": "Frothy, aromatic South Indian chicory-blend coffee decoction blended with hot boiled milk."
    },
    {
        "key": "tamilnadu_semya_payasam",
        "canonicalIds": ["semya_payasam", "semiya_payasam", "vermicelli_kheer"],
        "exactDishName": "Semya Payasam",
        "aliases": ["semya payasam", "semiya payasam", "vermicelli payasam", "semiya kheer"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_semya_payasam.png",
        "isVegetarian": True,
        "description": "Golden roasted vermicelli simmered in cardamom-scented milk, garnished with ghee-fried cashews and golden raisins."
    },
    {
        "key": "tamilnadu_adhirasam",
        "canonicalIds": ["adhirasam", "athirasam"],
        "exactDishName": "Adhirasam",
        "aliases": ["adhirasam", "athirasam", "jaggery rice fritter"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_adhirasam.png",
        "isVegetarian": True,
        "description": "Traditional celebratory pastry made from fermented raw rice flour and dark country jaggery with dry ginger and cardamom."
    },
    {
        "key": "tamilnadu_murukku",
        "canonicalIds": ["murukku", "chakli", "thenkuzhal"],
        "exactDishName": "Murukku",
        "aliases": ["murukku", "chakli", "thenkuzhal murukku", "rice murukku"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_murukku.png",
        "isVegetarian": True,
        "description": "Crunchy spiral snack made from rice and urad dal flour seasoned with cumin, sesame, and asafoetida."
    },
    {
        "key": "tamilnadu_sundal",
        "canonicalIds": ["sundal", "chana_sundal", "konda_kadalai_sundal"],
        "exactDishName": "Sundal",
        "aliases": ["sundal", "chana sundal", "konda kadalai sundal", "black chickpea sundal"],
        "state": "Tamil Nadu",
        "cropFile": "tamilnadu_sundal.png",
        "isVegetarian": True,
        "description": "Steamed protein-rich chickpeas or white peas tossed with mustard seeds, curry leaves, green chilies, and fresh coconut."
    },

    # KERALA (24 dishes)
    {
        "key": "kerala_puttu",
        "canonicalIds": ["puttu", "puttu_kadala"],
        "exactDishName": "Puttu",
        "aliases": ["puttu", "kerala puttu", "steamed rice cylinders", "ari puttu"],
        "state": "Kerala",
        "cropFile": "kerala_puttu.png",
        "isVegetarian": True,
        "description": "Steamed cylindrical rice flour layered with freshly grated coconut, providing clean energy and pairing well with kadala curry."
    },
    {
        "key": "kerala_appam",
        "canonicalIds": ["kerala_appam", "kerala_palappam"],
        "exactDishName": "Appam",
        "aliases": ["appam", "palappam", "kerala appam", "vellayappam"],
        "state": "Kerala",
        "cropFile": "kerala_appam.png",
        "isVegetarian": True,
        "description": "Fermented rice batter pancake with a spongy soft center and lacy crisp border, gentle and easily absorbed."
    },
    {
        "key": "kerala_idiyappam",
        "canonicalIds": ["kerala_idiyappam", "noolputtu"],
        "exactDishName": "Idiyappam",
        "aliases": ["idiyappam", "kerala idiyappam", "noolputtu", "string hoppers"],
        "state": "Kerala",
        "cropFile": "kerala_idiyappam.png",
        "isVegetarian": True,
        "description": "Steamed string hoppers prepared from roasted rice flour, offering very light carbohydrate fuel."
    },
    {
        "key": "kerala_parotta",
        "canonicalIds": ["kerala_parotta", "malabar_parotta"],
        "exactDishName": "Kerala Parotta",
        "aliases": ["kerala parotta", "malabar parotta", "layered parotta"],
        "state": "Kerala",
        "cropFile": "kerala_parotta.png",
        "isVegetarian": True,
        "description": "Flaky, layered traditional flatbread characteristic of Malabar cuisine."
    },
    {
        "key": "kerala_pazhampori",
        "canonicalIds": ["pazhampori", "ethakka_appam"],
        "exactDishName": "Pazhampori",
        "aliases": ["pazhampori", "banana fritters", "ethakka appam", "pazham pori"],
        "state": "Kerala",
        "cropFile": "kerala_pazhampori.png",
        "isVegetarian": True,
        "description": "Sweet golden-fried ripe Nendran banana slices dipped in batter, high in potassium and quick natural energy."
    },
    {
        "key": "kerala_banana_chips",
        "canonicalIds": ["banana_chips", "upperi"],
        "exactDishName": "Banana Chips",
        "aliases": ["banana chips", "kerala banana chips", "upperi", "ethakka upperi"],
        "state": "Kerala",
        "cropFile": "kerala_banana_chips.png",
        "isVegetarian": True,
        "description": "Crisp thin slices of raw Kerala plantain crisped in pure coconut oil with a pinch of turmeric and rock salt."
    },
    {
        "key": "kerala_kadala_curry",
        "canonicalIds": ["kadala_curry", "kerala_kadala"],
        "exactDishName": "Kadala Curry",
        "aliases": ["kadala curry", "kerala kadala curry", "black chickpea curry", "kadala"],
        "state": "Kerala",
        "cropFile": "kerala_kadala_curry.png",
        "isVegetarian": True,
        "description": "Wholesome black chickpea curry simmered in roasted coconut gravy with coriander, fennel, and curry leaves."
    },
    {
        "key": "kerala_avial",
        "canonicalIds": ["avial", "kerala_02"],
        "exactDishName": "Avial",
        "aliases": ["avial", "aviyal", "kerala avial", "mixed veg avial"],
        "state": "Kerala",
        "cropFile": "kerala_avial.png",
        "isVegetarian": True,
        "description": "Nutrient-dense medley of indigenous vegetables steamed and dressed with coarse ground coconut, cumin, curd, and coconut oil."
    },
    {
        "key": "kerala_olan",
        "canonicalIds": ["olan", "kerala_olan"],
        "exactDishName": "Olan",
        "aliases": ["olan", "ash gourd olan", "kumbalanga olan"],
        "state": "Kerala",
        "cropFile": "kerala_olan.png",
        "isVegetarian": True,
        "description": "Delicate stew of ash gourd and red cowpeas (vanpayar) cooked in thin coconut milk and finished with virgin coconut oil."
    },
    {
        "key": "kerala_erissery",
        "canonicalIds": ["erissery", "mathanga_erissery"],
        "exactDishName": "Erissery",
        "aliases": ["erissery", "mathanga erissery", "pumpkin erissery", "elisseri"],
        "state": "Kerala",
        "cropFile": "kerala_erissery.png",
        "isVegetarian": True,
        "description": "Sweet yellow pumpkin and cowpeas stewed with coconut and topped with deeply toasted grated coconut."
    },
    {
        "key": "kerala_kalan",
        "canonicalIds": ["kalan", "kurukku_kalan"],
        "exactDishName": "Kalan",
        "aliases": ["kalan", "kurukku kalan", "moru kalan", "yam kalan"],
        "state": "Kerala",
        "cropFile": "kerala_kalan.png",
        "isVegetarian": True,
        "description": "Thick yogurt and coconut curry simmered with elephant foot yam and raw plantain, flavored with black pepper and fenugreek."
    },
    {
        "key": "kerala_thoran",
        "canonicalIds": ["thoran", "cabbage_thoran", "beans_thoran"],
        "exactDishName": "Thoran",
        "aliases": ["thoran", "cabbage thoran", "cheera thoran", "beans thoran"],
        "state": "Kerala",
        "cropFile": "kerala_thoran.png",
        "isVegetarian": True,
        "description": "Quick dry vegetable stir-fry with grated coconut, shallots, green chilies, and tempered mustard seeds."
    },
    {
        "key": "kerala_pachadi",
        "canonicalIds": ["pachadi", "beetroot_pachadi", "vellarikka_pachadi"],
        "exactDishName": "Pachadi",
        "aliases": ["pachadi", "beetroot pachadi", "vellarikka pachadi", "kerala pachadi"],
        "state": "Kerala",
        "cropFile": "kerala_pachadi.png",
        "isVegetarian": True,
        "description": "Vibrant ruby-red beetroot and yogurt accompaniment ground with coconut and mustard, providing nitrates and probiotics."
    },
    {
        "key": "kerala_kichadi",
        "canonicalIds": ["kichadi", "kerala_kichadi"],
        "exactDishName": "Kichadi",
        "aliases": ["kichadi", "cucumber kichadi", "pavakka kichadi", "kerala kichadi"],
        "state": "Kerala",
        "cropFile": "kerala_kichadi.png",
        "isVegetarian": True,
        "description": "Soothing yogurt-based side dish prepared with cucumbers or okra and seasoned with freshly ground mustard."
    },
    {
        "key": "kerala_sambar",
        "canonicalIds": ["kerala_sambar", "varutharacha_sambar"],
        "exactDishName": "Sambar (Kerala Style)",
        "aliases": ["kerala sambar", "varutharacha sambar", "sambar kerala style"],
        "state": "Kerala",
        "cropFile": "kerala_sambar.png",
        "isVegetarian": True,
        "description": "Rich roasted-coconut (varutharacha) sambar simmered with toor dal, shallots, drumstick, and tamarind."
    },
    {
        "key": "kerala_rasam",
        "canonicalIds": ["kerala_rasam"],
        "exactDishName": "Rasam",
        "aliases": ["kerala rasam", "rasam kerala style"],
        "state": "Kerala",
        "cropFile": "kerala_rasam.png",
        "isVegetarian": True,
        "description": "Tart and spicy digestive pepper-tamarind broth with fresh curry leaves and garlic."
    },
    {
        "key": "kerala_prawn_curry",
        "canonicalIds": ["kerala_prawn_curry", "chemmeen_curry"],
        "exactDishName": "Prawn Curry (Chemmeen Curry)",
        "aliases": ["prawn curry", "chemmeen curry", "chemmeen theeyal", "kerala chemmeen"],
        "state": "Kerala",
        "cropFile": "kerala_prawn_curry.png",
        "isVegetarian": False,
        "description": "Fresh sea prawns simmered in rich coconut milk and kudampuli (Malabar tamarind), abundant in lean protein, zinc, and DHA."
    },
    {
        "key": "kerala_fish_curry",
        "canonicalIds": ["kerala_fish_curry", "kerala_01", "meen_curry"],
        "exactDishName": "Fish Curry (Meen Curry)",
        "aliases": ["fish curry", "meen curry", "kerala fish curry", "kottayam fish curry"],
        "state": "Kerala",
        "cropFile": "kerala_fish_curry.png",
        "isVegetarian": False,
        "description": "Traditional earthen-pot Kerala fish curry steeped in Malabar tamarind (kudampuli), red chili, fenugreek, and fresh curry leaves."
    },
    {
        "key": "kerala_karimeen_pollichathu",
        "canonicalIds": ["karimeen_pollichathu"],
        "exactDishName": "Karimeen Pollichathu",
        "aliases": ["karimeen pollichathu", "pearl spot fish fry", "banana leaf fish"],
        "state": "Kerala",
        "cropFile": "kerala_karimeen_pollichathu.png",
        "isVegetarian": False,
        "description": "Fresh pearl spot fish marinated in spicy shallot-tomato masala and slow-pan-cooked wrapped in banana leaves."
    },
    {
        "key": "kerala_malabar_biryani",
        "canonicalIds": ["malabar_biryani", "thalassery_biryani"],
        "exactDishName": "Malabar Biryani",
        "aliases": ["malabar biryani", "thalassery biryani", "kerala biryani"],
        "state": "Kerala",
        "cropFile": "kerala_malabar_biryani.png",
        "isVegetarian": False,
        "description": "Aromatic short-grain Khyma rice dum-cooked with tender spiced chicken, ghee, fried shallots, and cashews."
    },
    {
        "key": "kerala_pathiri",
        "canonicalIds": ["pathiri", "ari_pathiri"],
        "exactDishName": "Pathiri",
        "aliases": ["pathiri", "ari pathiri", "rice roti kerala", "malabar pathiri"],
        "state": "Kerala",
        "cropFile": "kerala_pathiri.png",
        "isVegetarian": True,
        "description": "Paper-thin soft flatbread prepared from roasted rice flour dough, exceptionally light on digestion."
    },
    {
        "key": "kerala_unniyappam",
        "canonicalIds": ["unniyappam", "unni_appam"],
        "exactDishName": "Umma/Unniyappam",
        "aliases": ["unniyappam", "unni appam", "kerala sweet fritters", "neyyappam"],
        "state": "Kerala",
        "cropFile": "kerala_unniyappam.png",
        "isVegetarian": True,
        "description": "Mini golden dome fritters made from ripe bananas, roasted rice flour, jaggery, cardamom, and coconut bits."
    },
    {
        "key": "kerala_palada_payasam",
        "canonicalIds": ["palada_payasam", "palada_pradhaman"],
        "exactDishName": "Palada Payasam",
        "aliases": ["palada payasam", "palada pradhaman", "kerala rice flake kheer"],
        "state": "Kerala",
        "cropFile": "kerala_palada_payasam.png",
        "isVegetarian": True,
        "description": "Silky pink dessert made by slow-reducing cow milk with thin steamed rice flakes (ada) and sugar over several hours."
    },
    {
        "key": "kerala_ada_pradhaman",
        "canonicalIds": ["ada_pradhaman"],
        "exactDishName": "Ada Pradhaman",
        "aliases": ["ada pradhaman", "jaggery ada payasam", "pradhaman"],
        "state": "Kerala",
        "cropFile": "kerala_ada_pradhaman.png",
        "isVegetarian": True,
        "description": "Grand festival dessert of rice crisps (ada) simmered in coconut milk and molten dark jaggery spiced with dry ginger."
    },

    # ANDHRA PRADESH & TELANGANA (24 dishes)
    {
        "key": "andhra_pulihora",
        "canonicalIds": ["pulihora", "andhra_pulihora", "chintapandu_pulihora"],
        "exactDishName": "Pulihora",
        "aliases": ["pulihora", "andhra pulihora", "tamarind rice andhra", "chintapandu pulihora"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_pulihora.png",
        "isVegetarian": True,
        "description": "Andhra tamarind rice spiced with mustard, green chilies, curry leaves, and crunchy peanuts, rich in natural tang and minerals."
    },
    {
        "key": "andhra_pesarattu",
        "canonicalIds": ["pesarattu", "mlau_pesarattu"],
        "exactDishName": "Pesarattu",
        "aliases": ["pesarattu", "green gram dosa", "moong dal dosa", "andhra pesarattu"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_pesarattu.png",
        "isVegetarian": True,
        "description": "Whole green moong dal crepe packed with dietary protein, fiber, and folate; supports steady glycemic regulation."
    },
    {
        "key": "andhra_upma",
        "canonicalIds": ["andhra_upma", "upma_pesarattu"],
        "exactDishName": "Upma",
        "aliases": ["upma", "andhra upma", "godhuma upma", "bombay rava upma"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_upma.png",
        "isVegetarian": True,
        "description": "Hearty semolina breakfast dish tempered with ginger, green chilies, cashews, and fresh curry leaves."
    },
    {
        "key": "andhra_bobbatlu",
        "canonicalIds": ["bobbatlu", "puran_poli", "holige"],
        "exactDishName": "Bobbatlu",
        "aliases": ["bobbatlu", "holige", "puran poli", "bobbattu", "obbattu"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_bobbatlu.png",
        "isVegetarian": True,
        "description": "Sweet flatbread filled with slow-cooked chana dal and jaggery spiced with nutmeg and cardamom."
    },
    {
        "key": "andhra_gongura_pachadi",
        "canonicalIds": ["gongura_pachadi", "gongura_pappu", "andhra_01"],
        "exactDishName": "Gongura Pachadi",
        "aliases": ["gongura pachadi", "gongura chutney", "sorrel leaves chutney", "gongura pappu"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_gongura_pachadi.png",
        "isVegetarian": True,
        "description": "Signature Andhra chutney made from tangy red sorrel leaves, rich in bioavailable iron, vitamin C, and antioxidants."
    },
    {
        "key": "andhra_tomato_pappu",
        "canonicalIds": ["tomato_pappu", "andhra_pappu"],
        "exactDishName": "Tomato Pappu",
        "aliases": ["tomato pappu", "andhra tomato dal", "tamata pappu"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_tomato_pappu.png",
        "isVegetarian": True,
        "description": "Creamy toor dal cooked with ripe tomatoes, green chilies, and garlic, tempered with ghee and cumin."
    },
    {
        "key": "andhra_pappu_charu",
        "canonicalIds": ["pappu_charu", "andhra_charu"],
        "exactDishName": "Pappu Charu",
        "aliases": ["pappu charu", "lentil soup andhra", "andhra lentil stew"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_pappu_charu.png",
        "isVegetarian": True,
        "description": "Traditional slow-simmered lentil and tamarind soup infused with drumsticks, shallots, and fresh coriander."
    },
    {
        "key": "andhra_gutti_vankaya",
        "canonicalIds": ["gutti_vankaya", "gutti_vankaya_kura"],
        "exactDishName": "Gutti Vankaya",
        "aliases": ["gutti vankaya", "gutti vankaya kura", "stuffed brinjal andhra"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_gutti_vankaya.png",
        "isVegetarian": True,
        "description": "Tender small eggplants stuffed with aromatic roasted peanut, sesame seed, desiccated coconut, and coriander spice paste."
    },
    {
        "key": "andhra_chicken_curry",
        "canonicalIds": ["andhra_chicken_curry", "andhra_kodi_kura"],
        "exactDishName": "Andhra Chicken Curry",
        "aliases": ["andhra chicken curry", "kodi kura", "andhra style chicken"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_chicken_curry.png",
        "isVegetarian": False,
        "description": "Country chicken curry prepared with freshly ground poppy seeds, coriander, garlic, and fiery Guntur chilies."
    },
    {
        "key": "andhra_kodi_pulao",
        "canonicalIds": ["kodi_pulao", "andhra_chicken_pulao"],
        "exactDishName": "Kodi Pulao",
        "aliases": ["kodi pulao", "andhra kodi pulao", "chicken pulao andhra"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_kodi_pulao.png",
        "isVegetarian": False,
        "description": "Fragrant rice pilaf gently infused with tender marinated chicken, whole whole garam masala spices, and mint."
    },
    {
        "key": "andhra_royyala_iguru",
        "canonicalIds": ["royyala_iguru", "andhra_02", "andhra_prawn_curry"],
        "exactDishName": "Royyala Iguru",
        "aliases": ["royyala iguru", "prawn curry andhra", "andhra prawn roast"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_royyala_iguru.png",
        "isVegetarian": False,
        "description": "Coastal Andhra style spicy prawn dry gravy packed with lean protein, omega-3 fatty acids, and selenium."
    },
    {
        "key": "andhra_chepala_pulusu",
        "canonicalIds": ["chepala_pulusu", "andhra_fish_curry"],
        "exactDishName": "Chepala Pulusu",
        "aliases": ["chepala pulusu", "andhra fish curry", "tangy fish curry"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_chepala_pulusu.png",
        "isVegetarian": False,
        "description": "Traditional tangy freshwater fish curry stewed in ripe tamarind pulp with fenugreek and mustard seeds."
    },
    {
        "key": "andhra_ragi_sangati",
        "canonicalIds": ["ragi_sangati", "rayalaseema_ragi_sangati"],
        "exactDishName": "Ragi Sangati",
        "aliases": ["ragi sangati", "rayalaseema ragi mudde", "ragi sankati"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_ragi_sangati.png",
        "isVegetarian": True,
        "description": "Rayalaseema specialty ball of steamed rice and finger millet flour, providing high calcium and iron."
    },
    {
        "key": "telangana_sarva_pindi",
        "canonicalIds": ["sarva_pindi", "telangana_01"],
        "exactDishName": "Sarva Pindi",
        "aliases": ["sarva pindi", "tappala chekka", "telangana rice pancake"],
        "state": "Telangana",
        "cropFile": "andhra_sarva_pindi.png",
        "isVegetarian": True,
        "description": "Crisp savory skillet pancake from Telangana made of rice flour, chana dal, peanuts, sesame seeds, and curry leaves."
    },
    {
        "key": "andhra_punugulu",
        "canonicalIds": ["punugulu", "punukulu"],
        "exactDishName": "Punugulu",
        "aliases": ["punugulu", "punukulu", "bonda from dosa batter"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_punugulu.png",
        "isVegetarian": True,
        "description": "Golden crisp round fritters prepared from fermented idli/dosa batter, paired with spicy tomato and peanut chutney."
    },
    {
        "key": "andhra_mirchi_bajji",
        "canonicalIds": ["mirchi_bajji", "mirapakaya_bajji"],
        "exactDishName": "Mirchi Bajji",
        "aliases": ["mirchi bajji", "mirapakaya bajji", "andhra chilli fritters"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_mirchi_bajji.png",
        "isVegetarian": True,
        "description": "Large mild green peppers stuffed with ajwain and tangy tamarind paste, dipped in chickpea batter and crisped."
    },
    {
        "key": "andhra_ulavacharu",
        "canonicalIds": ["ulavacharu", "horse_gram_soup_andhra"],
        "exactDishName": "Ulavacharu",
        "aliases": ["ulavacharu", "ulava charu", "horse gram soup andhra"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_ulavacharu.png",
        "isVegetarian": True,
        "description": "Thick, hearty stew cooked from slow-simmered horse gram, renowned for boosting hemoglobin and bodily warmth."
    },
    {
        "key": "andhra_pachhi_pulusu",
        "canonicalIds": ["pachhi_pulusu", "raw_rasam"],
        "exactDishName": "Pachhi Pulusu",
        "aliases": ["pachhi pulusu", "pachi pulusu", "raw rasam"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_pachhi_pulusu.png",
        "isVegetarian": True,
        "description": "Uncooked cooling tamarind broth tempered with roasted green chilies, finely diced onions, and cumin."
    },
    {
        "key": "andhra_avakaya",
        "canonicalIds": ["avakaya", "andhra_mango_pickle"],
        "exactDishName": "Avakaya",
        "aliases": ["avakaya", "andhra avakaya", "mango pickle andhra"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_avakaya.png",
        "isVegetarian": True,
        "description": "Famous Andhra mango pickle preserved with mustard seed powder, red chili, garlic, and cold-pressed sesame oil."
    },
    {
        "key": "andhra_bendakaya_fry",
        "canonicalIds": ["bendakaya_fry", "okra_fry_andhra"],
        "exactDishName": "Bendakaya Fry",
        "aliases": ["bendakaya fry", "okra fry", "bhindi fry andhra", "bendakaya vepudu"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_bendakaya_fry.png",
        "isVegetarian": True,
        "description": "Crisp pan-fried okra tossed with roasted peanuts, garlic cloves, curry leaves, and cumin, rich in dietary fiber."
    },
    {
        "key": "andhra_munagakaya_pappu",
        "canonicalIds": ["munagakaya_pappu", "drumstick_dal_andhra"],
        "exactDishName": "Munagakaya Pappu",
        "aliases": ["munagakaya pappu", "drumstick dal", "moringa dal"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_munagakaya_pappu.png",
        "isVegetarian": True,
        "description": "Nutritious toor dal stewed with fresh tender drumstick pods (moringa), providing dietary calcium, iron, and vitamin A."
    },
    {
        "key": "andhra_pootharekulu",
        "canonicalIds": ["pootharekulu", "paper_sweet"],
        "exactDishName": "Pootharekulu",
        "aliases": ["pootharekulu", "putharekulu", "paper sweet andhra"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_pootharekulu.png",
        "isVegetarian": True,
        "description": "Delicate wafer-thin rice starch edible paper rolls layered with powdered sugar or jaggery, ghee, and chopped nuts."
    },
    {
        "key": "andhra_ariselu",
        "canonicalIds": ["ariselu", "athirasam_andhra"],
        "exactDishName": "Ariselu",
        "aliases": ["ariselu", "arisa", "sesame jaggery cakes"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_ariselu.png",
        "isVegetarian": True,
        "description": "Traditional festival delicacy made of fresh rice flour and jaggery syrup, crusted with calcium-rich sesame seeds."
    },
    {
        "key": "andhra_bellam_paramannam",
        "canonicalIds": ["bellam_paramannam", "jaggery_rice_pudding"],
        "exactDishName": "Bellam Paramannam",
        "aliases": ["bellam paramannam", "jaggery sweet pongal", "paramannam"],
        "state": "Andhra Pradesh",
        "cropFile": "andhra_bellam_paramannam.png",
        "isVegetarian": True,
        "description": "Wholesome festive pudding cooked from rice, moong dal, cow milk, and mineral-dense jaggery, finished with ghee and cashews."
    },

    # PUDUCHERRY (24 dishes)
    {
        "key": "puducherry_idli",
        "canonicalIds": ["puducherry_idli"],
        "exactDishName": "Idli (Puducherry Style)",
        "aliases": ["puducherry idli", "idli puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_idli.png",
        "isVegetarian": True,
        "description": "Soft steamed rice cakes served with coastal French-Tamil coconut and tomato accompaniments."
    },
    {
        "key": "puducherry_dosa",
        "canonicalIds": ["puducherry_dosa"],
        "exactDishName": "Dosa (Puducherry Style)",
        "aliases": ["puducherry dosa", "dosa puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_dosa.png",
        "isVegetarian": True,
        "description": "Crispy golden crepe served with freshly ground herb chutneys and gentle vegetable sambar."
    },
    {
        "key": "puducherry_appam",
        "canonicalIds": ["puducherry_appam"],
        "exactDishName": "Appam (Puducherry Style)",
        "aliases": ["puducherry appam", "appam puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_appam.png",
        "isVegetarian": True,
        "description": "Lacy fermented rice pancake paired with aromatic sweetened coconut milk or Creole stew."
    },
    {
        "key": "puducherry_idiyappam",
        "canonicalIds": ["puducherry_idiyappam"],
        "exactDishName": "Idiyappam (Puducherry Style)",
        "aliases": ["puducherry idiyappam", "idiyappam puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_idiyappam.png",
        "isVegetarian": True,
        "description": "Steamed rice hoppers served alongside creamy vegetable ragout or sweetened coconut extract."
    },
    {
        "key": "puducherry_pongal",
        "canonicalIds": ["puducherry_pongal"],
        "exactDishName": "Pongal (Puducherry Style)",
        "aliases": ["puducherry pongal", "pongal puducherry style"],
        "state": "Puducherry",
        "cropFile": "puducherry_pongal.png",
        "isVegetarian": True,
        "description": "Comforting rice and split moong dal porridge infused with black peppercorns, ginger, and cashews."
    },
    {
        "key": "puducherry_vegetable_stew",
        "canonicalIds": ["puducherry_vegetable_stew", "creole_veg_stew"],
        "exactDishName": "Vegetable Stew (Puducherry Style)",
        "aliases": ["vegetable stew puducherry", "puducherry vegetable stew", "creole veg stew"],
        "state": "Puducherry",
        "cropFile": "puducherry_vegetable_stew.png",
        "isVegetarian": True,
        "description": "Mild, soothing medley of carrots, green peas, beans, and potatoes simmered in fresh coconut milk with green cardamom."
    },
    {
        "key": "puducherry_fish_curry",
        "canonicalIds": ["puducherry_fish_curry", "puducherry_02", "creole_fish_curry"],
        "exactDishName": "Fish Curry (Puducherry Style)",
        "aliases": ["puducherry fish curry", "creole fish curry", "puducherry coconut fish fillet"],
        "state": "Puducherry",
        "cropFile": "puducherry_fish_curry.png",
        "isVegetarian": False,
        "description": "French-Creole influenced coastal fish curry cooked with mild spices, coconut milk, and fresh herbs."
    },
    {
        "key": "puducherry_prawn_curry",
        "canonicalIds": ["puducherry_prawn_curry", "creole_prawn_curry"],
        "exactDishName": "Prawn Curry (Puducherry Style)",
        "aliases": ["puducherry prawn curry", "creole prawn curry", "puducherry royyalu"],
        "state": "Puducherry",
        "cropFile": "puducherry_prawn_curry.png",
        "isVegetarian": False,
        "description": "Tender coastal prawns cooked in a delicate tomato-coconut reduction with garlic and curry leaves."
    },
    {
        "key": "puducherry_crab_masala",
        "canonicalIds": ["puducherry_crab_masala", "crab_masala"],
        "exactDishName": "Crab Masala",
        "aliases": ["crab masala", "puducherry crab masala", "nandu masala"],
        "state": "Puducherry",
        "cropFile": "puducherry_crab_masala.png",
        "isVegetarian": False,
        "description": "Fresh sea crab simmered in pepper-coriander and shallot gravy, high in bioavailable zinc, selenium, and protein."
    },
    {
        "key": "puducherry_chicken_curry",
        "canonicalIds": ["puducherry_chicken_curry", "creole_chicken_curry"],
        "exactDishName": "Chicken Curry (Puducherry Style)",
        "aliases": ["puducherry chicken curry", "creole chicken curry"],
        "state": "Puducherry",
        "cropFile": "puducherry_chicken_curry.png",
        "isVegetarian": False,
        "description": "Tender chicken simmered in an aromatic blend of fennel seeds, cinnamon, shallots, and rich coconut gravy."
    },
    {
        "key": "puducherry_mutton_curry",
        "canonicalIds": ["puducherry_mutton_curry", "creole_mutton_curry", "telangana_02"],
        "exactDishName": "Mutton Curry (Puducherry Style)",
        "aliases": ["puducherry mutton curry", "creole mutton curry", "mutton curry puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_mutton_curry.png",
        "isVegetarian": False,
        "description": "Slow-braised mutton pieces cooked in a spiced bone-broth gravy rich in iron, zinc, and collagen."
    },
    {
        "key": "puducherry_biryani",
        "canonicalIds": ["puducherry_biryani", "creole_biryani"],
        "exactDishName": "Puducherry Biryani",
        "aliases": ["puducherry biryani", "creole biryani", "french puducherry biryani"],
        "state": "Puducherry",
        "cropFile": "puducherry_biryani.png",
        "isVegetarian": False,
        "description": "Fragrant Seeraga Samba rice cooked with aromatic chicken, whole spices, mint, coriander, and ghee."
    },
    {
        "key": "puducherry_lemon_rice",
        "canonicalIds": ["puducherry_lemon_rice"],
        "exactDishName": "Lemon Rice",
        "aliases": ["puducherry lemon rice", "lemon rice puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_lemon_rice.png",
        "isVegetarian": True,
        "description": "Bright, zesty lemon-infused rice with roasted peanuts, curry leaves, ginger, and turmeric."
    },
    {
        "key": "puducherry_coconut_rice",
        "canonicalIds": ["puducherry_coconut_rice", "coconut_rice"],
        "exactDishName": "Coconut Rice",
        "aliases": ["coconut rice", "thegai sadam", "puducherry coconut rice"],
        "state": "Puducherry",
        "cropFile": "puducherry_coconut_rice.png",
        "isVegetarian": True,
        "description": "Steamed white rice sautéed with fresh grated coconut, cashews, ginger, and green chilies in cow ghee."
    },
    {
        "key": "puducherry_puliyodarai",
        "canonicalIds": ["puducherry_puliyodarai"],
        "exactDishName": "Puliyodarai",
        "aliases": ["puducherry puliyodarai", "tamarind rice puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_puliyodarai.png",
        "isVegetarian": True,
        "description": "Tamarind-spiced rice seasoned with sesame, peanuts, and roasted red chilies."
    },
    {
        "key": "puducherry_thayir_sadam",
        "canonicalIds": ["puducherry_thayir_sadam"],
        "exactDishName": "Thayir Sadam",
        "aliases": ["puducherry thayir sadam", "curd rice puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_thayir_sadam.png",
        "isVegetarian": True,
        "description": "Gentle curd rice with pomegranate and mustard seed tempering, cooling and gut-supportive."
    },
    {
        "key": "puducherry_medu_vada",
        "canonicalIds": ["puducherry_medu_vada", "medu_vada", "vada"],
        "exactDishName": "Medu Vada",
        "aliases": ["medu vada", "urad dal vada", "meduvada", "vada"],
        "state": "Puducherry",
        "cropFile": "puducherry_medu_vada.png",
        "isVegetarian": True,
        "description": "Crispy doughnut-shaped savory fritters prepared from soaked black gram batter with crushed peppercorns and ginger."
    },
    {
        "key": "puducherry_kootu",
        "canonicalIds": ["puducherry_kootu"],
        "exactDishName": "Kootu",
        "aliases": ["puducherry kootu", "vegetable kootu puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_kootu.png",
        "isVegetarian": True,
        "description": "Hearty vegetable and lentil stew made with yellow moong dal and coconut paste."
    },
    {
        "key": "puducherry_aviyal",
        "canonicalIds": ["puducherry_aviyal"],
        "exactDishName": "Aviyal",
        "aliases": ["puducherry aviyal", "aviyal puducherry style"],
        "state": "Puducherry",
        "cropFile": "puducherry_aviyal.png",
        "isVegetarian": True,
        "description": "Steamed indigenous vegetables cooked with curd and coconut paste, finished with aromatic coconut oil."
    },
    {
        "key": "puducherry_ratatouille",
        "canonicalIds": ["puducherry_ratatouille", "puducherry_01", "creole_vegetable_ragout"],
        "exactDishName": "Ratatouille (Puducherry Influence)",
        "aliases": ["ratatouille puducherry", "creole vegetable ragout", "french puducherry ratatouille", "vegetable ragout"],
        "state": "Puducherry",
        "cropFile": "puducherry_ratatouille.png",
        "isVegetarian": True,
        "description": "Franco-Pondicherrian stew of zucchini, eggplant, bell peppers, and tomatoes simmered with local herbs and olive oil."
    },
    {
        "key": "puducherry_baguette_sandwich",
        "canonicalIds": ["puducherry_baguette_sandwich", "baguette_sandwich"],
        "exactDishName": "Baguette Sandwich (Puducherry Influence)",
        "aliases": ["baguette sandwich", "puducherry baguette", "french baguette sandwich"],
        "state": "Puducherry",
        "cropFile": "puducherry_baguette_sandwich.png",
        "isVegetarian": True,
        "description": "Fresh artisan French baguette filled with garden vegetables, cucumbers, tomatoes, and herb spread."
    },
    {
        "key": "puducherry_caramel_pudding",
        "canonicalIds": ["puducherry_caramel_pudding", "caramel_pudding"],
        "exactDishName": "Caramel Pudding (Crème Caramel)",
        "aliases": ["caramel pudding", "creme caramel", "puducherry caramel custard"],
        "state": "Puducherry",
        "cropFile": "puducherry_caramel_pudding.png",
        "isVegetarian": True,
        "description": "Classic French-colonial steamed custard with golden caramelized sugar glaze."
    },
    {
        "key": "puducherry_paniyaram",
        "canonicalIds": ["puducherry_paniyaram"],
        "exactDishName": "Paniyaram (Puducherry Style)",
        "aliases": ["puducherry paniyaram", "paniyaram puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_paniyaram.png",
        "isVegetarian": True,
        "description": "Crisp golden rice-lentil batter balls served with mild herb chutneys."
    },
    {
        "key": "puducherry_semiya_payasam",
        "canonicalIds": ["puducherry_semiya_payasam"],
        "exactDishName": "Semiya Payasam",
        "aliases": ["puducherry semiya payasam", "semiya payasam puducherry"],
        "state": "Puducherry",
        "cropFile": "puducherry_semiya_payasam.png",
        "isVegetarian": True,
        "description": "Warm vermicelli milk pudding infused with crushed green cardamom, ghee, and golden sultanas."
    }
]

print(f"Total structured dishes: {len(dishes)}")

# Generate TS code
ts_lines = [
    "/**",
    " * Regional Uploaded Food Image Map",
    " * Maps the 116 high-resolution dishes cropped from the 5 uploaded regional collages",
    " * (Karnataka, Tamil Nadu, Kerala, Andhra Pradesh & Telangana, and Puducherry)",
    " * directly to stable Food IDs, regional aliases, and food database records.",
    " */",
    "",
    "import { FoodImageMetadata } from './food_image_registry';",
    "",
    "export const REGIONAL_UPLOADED_FOOD_MAP: Record<string, FoodImageMetadata> = {"
]

for d in dishes:
    crop_path = f"/assets/food_crops/{d['cropFile']}"
    aliases_json = json.dumps(d['aliases'])
    is_veg_str = "true" if d['isVegetarian'] else "false"
    
    entry_code = f"""  '{d["key"]}': {{
    dishId: '{d["key"]}',
    exactDishName: {json.dumps(d["exactDishName"])},
    regionalAliases: {aliases_json},
    state: '{d["state"]}',
    region: 'South',
    primaryUrl: '{crop_path}',
    fallbacks: ['{crop_path}'],
    imageSource: 'Uploaded Regional Cuisine Collage Panel',
    imageSourceType: 'user-uploaded',
    imageSourceName: '{d["state"]} Regional Food Dataset',
    imageAttribution: 'Uploaded Regional Collage ({d["state"]})',
    imageLicense: 'Uploaded Project Asset',
    isVerified: true,
    isVegetarian: {is_veg_str},
    dishDescription: {json.dumps(d["description"])}
  }},"""
    ts_lines.append(entry_code)

ts_lines.append("};")
ts_lines.append("")

# Canonical ID lookup index
ts_lines.append("// Index mapping canonical food IDs and names to the registry key")
ts_lines.append("export const CANONICAL_FOOD_ID_TO_UPLOADED_IMAGE_KEY: Record<string, string> = {")
seen_keys = set()
for d in dishes:
    for cid in d["canonicalIds"]:
        k = cid.lower()
        if k not in seen_keys:
            seen_keys.add(k)
            ts_lines.append(f"  '{k}': '{d['key']}',")
    for a in d["aliases"]:
        k = a.lower()
        if k not in seen_keys:
            seen_keys.add(k)
            ts_lines.append(f"  '{k}': '{d['key']}',")
ts_lines.append("};")
ts_lines.append("")

# Helper function
ts_lines.append("""/**
 * Resolves a dish name or food ID to its verified uploaded regional crop image.
 * Matches exact dish ID, canonical ID, or aliases while respecting vegetarian preferences.
 */
export function getRegionalUploadedDishImage(
  dishNameOrId?: string | null,
  isVegetarian?: boolean
): FoodImageMetadata | null {
  if (!dishNameOrId || dishNameOrId.trim().length === 0) return null;

  const raw = dishNameOrId.trim().toLowerCase();
  const clean = raw.replace(/^(karnataka|tamil\\s*nadu|kerala|andhra|telangana|puducherry)[_\\-\\s]+/i, '').trim();
  const withoutParens = clean.replace(/[\\(\\[].*?[\\)\\]]/g, '').trim();
  const normalized = withoutParens.replace(/[\\(\\),-]/g, ' ').replace(/\\s+/g, ' ').trim();

  // 1. Direct registry key match
  if (REGIONAL_UPLOADED_FOOD_MAP[raw]) {
    const item = REGIONAL_UPLOADED_FOOD_MAP[raw];
    if (isVegetarian === undefined || item.isVegetarian === undefined || item.isVegetarian === isVegetarian) {
      return item;
    }
  }

  // 2. Canonical mapping lookup
  const mappedKey = CANONICAL_FOOD_ID_TO_UPLOADED_IMAGE_KEY[raw] 
    || CANONICAL_FOOD_ID_TO_UPLOADED_IMAGE_KEY[clean]
    || CANONICAL_FOOD_ID_TO_UPLOADED_IMAGE_KEY[withoutParens]
    || CANONICAL_FOOD_ID_TO_UPLOADED_IMAGE_KEY[normalized];

  if (mappedKey && REGIONAL_UPLOADED_FOOD_MAP[mappedKey]) {
    const item = REGIONAL_UPLOADED_FOOD_MAP[mappedKey];
    if (isVegetarian === undefined || item.isVegetarian === undefined || item.isVegetarian === isVegetarian) {
      return item;
    }
  }

  // 3. Search exactDishName or aliases across all items
  for (const item of Object.values(REGIONAL_UPLOADED_FOOD_MAP)) {
    if (isVegetarian !== undefined && item.isVegetarian !== undefined && item.isVegetarian !== isVegetarian) {
      continue;
    }
    const nameLower = item.exactDishName.toLowerCase();
    const idLower = item.dishId.toLowerCase();

    if (
      nameLower === raw || nameLower === clean || nameLower === withoutParens ||
      idLower === raw || idLower === clean ||
      item.regionalAliases.some(alias => {
        const a = alias.toLowerCase();
        return raw === a || clean === a || withoutParens === a || normalized === a ||
               raw.includes(a) || clean.includes(a) || a.includes(clean);
      })
    ) {
      return item;
    }
  }

  return null;
}
""")

with open('src/data/regional_uploaded_images_map.ts', 'w') as out_f:
    out_f.write('\n'.join(ts_lines))

print("Created src/data/regional_uploaded_images_map.ts successfully!")
