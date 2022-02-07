export default {
    home: {
        title: "Asosiy",
    },
    user: {
        first_name: "Ism",
        last_name: "Familiya",
        phone: "Telefon raqami",
        password: "Parol",
        email: "E-mail",
        role: "Rol",
        phone_number: "Telefon raqami",
        validation_last_password: 'Eski parol noto’g’ri terilgan!',
        validation_password: 'Parol kamida 8 ta harf yoki raqamlardan iborat bo’lishi kerak!',
        validation_confirm_password: 'Tasdiqlash paroli yangi parol bilan bir xil bo’lishi kerak'
    },
    booked:'Band qilindi',
    not_for_sale: "Sotilmaydi",
    remove_from_sale: "Sotuvdan olib tashlash",
    return_to_sale: "Sotuvga qaytarish",
    edit: "Tahrirlash",
    upload_logo: "Logotipni yuklash",
    loading: 'Iltimos kuting...',
    add: "Qo'shish",
    delete: "O'chirish",
    action: "Xarakat",
    search: "Qidirish",
    save: "Saqlash",
    create: "Yaratish",
    view: "Ko'rish",
    cancel: "Bekor qilish",
    back: "Orqaga",
    next: "Davom etish",
    create_agree: "Tasdiqlash",
    yes: "Bor",
    no: "Yo'q",
    image: "Surat",
    address: "Manzil", // 'settings': 'Настройки',
    no_data: "Ma'lumotlar yo'q",
    logout: "Chiqish",
    list: "Ro'yxat",
    close: "Yopish",
    ye: "sum",
    usd: "$",
    general: "Umumiy",
    edit_password: "Parolni o'zgartirish",
    profile: 'Profil',
    category: 'Kategoriya',
    full: "To'liqligicha",
    monthly: "Oylik",
    payment_type: "To'lov sharti",
    created_at: "Yaratilgan vaqti",
    reservation: 'Band qilish',
    free_of_charge: "Boshlang'ich to'lovsiz",
    without_initial: "Boshlang'ich to'lovsiz",

    auth: {
        email: "E-mail",
        password: "parol",
        login: "Kirish",
        validation_email: 'Неправильный формат электронной почты',
        validation_password: 'Пароль должен содержать не менее 8 символов'
    },

    messages: {
        created: "Muvaffaqiyatli kiritildi!",
    },

    notifications: {
        title: "Bildirishnomalar",
    },

    contracts: {
        title: "Shartnomalar",
        download: "Shartnomani yuklab olish",
        f_i_o: 'F.I.SH', // asd
        filter_with_date: "Sana bo'yicha filtrlash", // asd
        client_name: 'Foydalanuvchi ismi', // asd
        client_phone: 'Telefon raqami', // asd
        price: 'Narxi', // asd
        object: "Ob'ekt", // asd

        view: {
            unfamiliar: "Notanish", // asd
            familiar: "Tanish", // asd
            edit_type: "Mijoz turini o'zgartirish", // asd
            save_btn: "Saqlash", // asd
            tariff: "Tarif", // asd
            dollar_rate: "Dollar kursi", // asd
            initial_fee: "Boshlang'ich to'lov", // asd
            apartment_price: "Xonadon narxi", // asd
            remainder: 'Qoldiq', // asd
            add_payment: "To'lov qo'shish", // asd
            schedule: "Jadval", // asd
            sum: "Summa", // asd
            cancel_btn: "Bekor qilish", // asd
            type: "Turi", // asd
            comment: "Izoh", // asd
            payment_type: "To'lov turi", // asd
            payment_date: "To'lov sanasi", // asd
            payment_sum: "To'lov summasi", // asd
            paid: "To'langan summa", // asd
            comments: "Izohlar", // asd
            no_comment: "Hozircha izohlar yo'q", // asd
            add_comment: "Izoh qo'shish", // asd
            download_contract: "Shartnomani yuklab olish", // asd
            cancel_contract: "Shartnomani bekor qilish", // asd
            payment_by_cash: "Naqd pul", // asd
            payment_transaction: "Pul ko'chirish orqali", // asd
            payment_other: "Boshqa to'lov turi", // asd
        },

    },

    roles: {
        title: "Rollar",
        name: "Nomi",
        users: "Foydalanuvchilar",

        permissions: {
            name_uz: "Rolning nomi (UZ)",
            name_ru: "Название роли (RU)",

            placeholder_uz: "O'zbek tilida",
            placeholder_ru: "Rus tilida",

            slug: "Guruh nomi prefiksi",

            objects: {
                view: "Obyektlarni ko'rishga ruxsat berish",
                create: "Obyekt yaratishga ruxsat berish",
                update: "Obyektlarni taxrirlashga ruxsat berish",
                delete: "Obyektlarni o'chirishga ruxsat berish",
                apartments: "Xonadonlar ro'yxatini ko'rishga ruxsat berish",
            },

            users: {
                view: "Foydalanuvchilarni ko'rishga ruxsat berish",
                create: "Foydalanuvchilar kiritishga ruxsat berish",
                update: "Foydalanuvchilarni taxrirlashga ruxsat berish",
                delete: "Foydalanuvchilarni o'chirishga ruxsat berish",
            },

            roles: {
                view: "Rollarni ko'rishga ruxsat berish",
                create: "Rollarni yaratishga ruxsat berish",
                update: "Rollarni taxrirlashga ruxsat berish",
                delete: "Rollarni o'chirishga ruxsat berish",
            },

            contracts: {
                view: "Shartnomalarni ko'rishga ruxsat berish",
                all: "Barcha shartnomalar uchun ruxsat berish",
                friends: "Tanish mijozlarni belgilashga ruxsat berish",
                cancelled: "Shartnomalarni bekor qilishga ruxsat berish",
                paid: "To'lovlarni qabul qilishga ruxsat berish",
                other_price: "Boshqa narx bilan sotishga ruxsat berish",
                change_date: "Shartnoma tuzilgan vaqtini o'zgartirishga ruxsat berish",
                monthly: "Oylik to'lovlarni o'zgartirishga ruxsat berish",
            },

            clients: {
                view: "Mijozlar ma'lumotlarini ko'rishga ruxsat berish",
                cancel_contract: "Band qilingan xonadonlarni bandlikdan chiqarishga ruxsat berish",
                delete: "Mijozlarni o'chirishga ruxsat berish",
                terminate: "Shartnomalarni bekor qilishga ruxsat berish",
                cancelled: "Bekor qilingan shartnomalarni ko'rishga ruxsat berish",
            },

            type_plan: {
                view: "Xonadonlar rejalarini ko'rishga ruxsat berish",
                update: "Xonadonlar rejalarini taxrirlashga ruxsat berish",
            },

            apartments: {
                view: "Xonadonlar haqida ma'lumotlarni ko'rishga ruxsat berish",
                reserve: "Xonadonlarni band qilishga ruxsat berish",
                contract: "Shartnoma tuzishga ruxsat berish",
                filter: "Xonadonlarni saralashga ruxsat berish (Filter)",
                edit: "Xonadonlarni taxrirlashga ruxsat berish (Xonadon raqami, xonalar soni, maydoni va hk.)",
                root_contract: "Shartnomalar uchun to'liq ruhsat berish",
            },

            debtors: {
                first_payment: "Birinchi to'lovlarni qabul qilishga ruxsat berish",
                first_payment_edit: "Birinchi to'lovni taxrir qilishga ruxsat berish",
                monthly_payment: "Oylik to'lovlarni qabul qilishga ruxsat berish",
                monthly_payment_edit: "Oylik to'lovlarni taxrir qilishga ruxsat berish",
            },

            // 'companies': {
            view: "Kompaniyalarni larni ko'rishga ruxsat berish",
            create: "Kompaniyalarni yaratishga ruxsat berish",
            update: "Kompaniyalarni taxrirlashga ruxsat berish",
            delete: "Kompaniyalarni o'chirishga ruxsat berish", // },
        },

        admin: "Administrator", manager: "Menedjer", accountant: "Xisobchi",
    },

    companies: {
        title: "Kompaniyalar",
        name: "Kompaniya",
        director: "Kompaniya direktori",
        type: "Kompaniya turi",
        inn: "STIR",
        mfo: "MFO",
        phone: "Telefon raqami",
        other_phone: "Qo'shimcha telefon raqami",
        payment_account: "Xisob raqami",
        bank_name: "Bank nomi",
        first_name: "Direktorning ismi",
        last_name: "Direktorning familiyasi",
        second_name: "Direktorning sharifi",

        type_enter: "Turini tanlang",
        branch_enter: "Kompaniyani tanlang",
    },

    apartments: {
        list: {
            choose: "Tanlash",
            reset: "Qayta o'rnatish",
            contract_all: "Barchasini tuzish",
            number: "Uy raqami",
            object: "Obyekt",
            rooms: "Xonalar soni",
            floor: "Qavat",
            area: "Maydoni",
            status: "Statusi",
            price: "Narxi",
            building: "Bino",
            block: "Korpus",
            book: "Band qilish",
            confirm: "Shartnoma tuzish",
            filter: "Filtr",
            apartments: "Xonadonlar",
            contract: "Shartnoma",

            entrance: "Kirish qismi",
            balcony: "Balkon",

            period_date: "Band qilish muddati",
            more: "To'liq ma'lumot",
            cancel_contract: "Shartnomani bekor qilish",
            download_contract: "Shartnomani yuklab olish",
            view_client: "Mijoz ma'lumotlarini ko'rish",
            cancel_reserve: "Xonadonni bandlikdan chiqarish",
            view_manager: "Menedjer haqida ma'lumot",

            price_sold: "Sotilgan narxi",
        },

        filter: {
            apartments: "Xonalar soni",
            floor: "Qavat",
            ot: "dan",
            do: "gacha",
            price: "Narx bo'yicha",
            area: "Maydon bo'yicha",
            object: "Obyekt",
            status: "Status bo'yicha",
            free: "Faqat mavjudlari",
            usd: "Narx $ da",
            clear: "Qayta o'rnatish ",
            blocks: "Binolar",
            contract_number: "Shartnoma raqami", // asd
            apartment_number: "Xonadon raqami", // asd
            filter_btn: "Filtrlash", // asd
        },

        view: {
            plan: "Xonadon rejasi",
            number: "Xonadon raqami",
            area: "Maydon",
            rooms: "Xonalar soni",
            floor: "Qavat",
            price_m2: "1м2 narxi",
            total_price: "Sotuvdagi narxi",
            status: "Status",
            variant: "To'lov varianti",
            other_variant: "Boshqa variant",
            enter_discount: "To'lov turini tanlang:", // agree.placeholder
            number_of_blocks: "Blok qavatlari soni", // asd
            object: "Ob'ekt", // asd
            address: "Manzil", // asd
            completion_date: "Qurib bitkazish sanasi", // asd
            price_for_m2: "1м2 narxi:", // asd
            discount_per_m2: "м2 uchun chegirma:", // asd
            prepayment: "Oldindan to'lov", // asd
            total: "Jami", // asd
            print: "Chop etish" // asd
        },

        agree: {
            number: "Shartnoma raqami",
            date_contract: "Shartnoma sanasi", // (месяц/число/год)
            first_name: "Ismi",
            last_name: "Familiyasi",
            second_name: "Sharifi",
            passport_series: "Pasport raqami",
            issued_by_whom: "Pasport berilgan joy",
            language: "Til",
            phone: "Telefon raqami",
            type_client: "Mijoz turi",
            other_phone: "Qo'shimcha telefon raqami",
            date_of_issue: "Pasport berilgan sana",
            birth_day: "Tug'ilgan sana", //(месяц/число/год)
            discounts: "Xarid turi",
            edit_price: "Narxni taxrirlash",
            edit_prices: "Narxni taxrirlash",
            first_payment_date: "Birinchi to'lov sanasi",
            payment_date: "Birinchi oylik to'lov sanasi",
            placeholder: {
                number: "D-6",
                date_contract: "20.12.2020",
                search: "Telefon raqami yoki pasport raqami orqali topish",

                first_name: "masalan: Ахмад",
                last_name: "masalan: Жасуров",
                second_name: "masalan: Хакимович",

                first_name_lotin: "masalan: Axmad",
                last_name_lotin: "masalan: Jasurov",
                second_name_lotin: "masalan: Khakimovich",

                passport_series: "masalan: AA1234567",
                issued_by_whom: "masalan: Тошкент шахар Олмазор тумани И.И.Б",
                phone: "masalan: +99899 123 45 67",
                other_phone: "masalan: +99899 765 43 21",
                enter_discount: "To'lov turini tanlang",
            },
        },
        tab_names: {
            all: "Hammasi", //asd
            available: "Mavjud", //asd
            booked: "Band qilingan", //asd
            sold: "Sotilgan", //asd
            unavailable: "Mavjud emas", //asd
        },
    },

    type_plan: {
        title: "Xonadon rejalari",
        name: "Nomlanishi",
        area: "Maydoni",
        balcony: "Balkon",
        no_img: "(xonadon rejasi mavjud emas)",
        yes_img: "(xonadon rejasi mavjud)",
        plan: "Xonadon rejasi",
        plans: "Barcha xonadon rejalari",
        list: "Xonadon rejalari ro'yxati",
    },

    debtors: {
        title: "Qarzdorlar",
        overdue: "Muddati o'tgan", // asd
        familiars: "Tanishlar", // asd
        contract_number: "№ shartnoma", // asd
        client_name: "mijoz ismi", // asd
        client_number: "mijoz raqami", // asd
        client_type: "mijoz turi", // asd

    },

    backup: {
        title: "Zaxira",
    },

    objects: {
        title: "Obyektlar",
        apartments: "Xonadonlar",
        address: "Manzil",
        full_address: "Shartnoma sanasi",
        build_date: "Qurib bitkazish sanasi",
        credit_month: "Bo'lib to'lashga beriladigan oylar soni",
        deal_file: 'Shartnoma fayli',
        select_category: 'Turini tanlash',
        sale: 'Sotuv',
        booking: 'Band qilish',
        make_it_main_contract: 'Asosiy shartnoma qilib belgilash',

        deal_template: {
            name: 'Shartoma andozasi', type: 'Turi', main: 'Asosiy',
        },

        create: {
            name: "Nomi",
            blocks_apartment: "XONADON BLOKLARI",
            copy_block: "BLOKNI KO'PAYTIRISH",
            copy_building: "BINONI KO'PAYTIRISH",
            balcony_price: "Balkon uchun narx",

            new: "Yangi obyekt yaratish",
            type_plan: "Xonadon rejalari turlari",
            no_type_plan: "xonadon rejalari mavjud emas",
            new_type_plan: "Xonadon rejasini yaratish",
            entrance: "Kirish joyi",
            other_price: "m2 uchun boshqa narx",
            price_m2: "m2 uchun narx",
            price_update: "Narxni o'zgartirish",
            clone_apartments: "Qavatni ko'paytirish",
            clone: "Ko'paytirish",
            choose_clone: "Qaysi qavatdan ko'chirilsin?",

            plan: {
                name: "Xonadon rejasi",
                area: "Maydon",
                balcony: "Balkoni bormi?",
                balcony_area: "Balkon maydoni",
                balcony_paid: "Balkon pullimi?",
            },

            apartments: "Xonadonlar",
            floors: "Qavatlar",

            blocks: "Bloklar",
            buildings: "Binolar",
            new_block: "Yangi blok",
            edit_block: "Blokni taxrirlash",
            count_floors: "Qavatlar soni",
            count_apartments: "Xonadonlar soni",

            price_area: "m2 uchun narx",
            new_price: "Yangi narx",
            create_price: "Narx qo'shish",
            alert_price: "Davom etish uchun qavatlar narxini qo'shing!",
            prices: "Narxlar",

            apartment: "Xonadon",
            floor: "Qavat",
            type_plan_apartment: "Xonadon rejasi turi",
            rooms: "Xonalar soni",
            area: "Maydoni",
            price: "Narxi",

            pre_pay: "Oldindan to'lov",
            discount: "Chegirma summasi",

            new_rules_discount: "Yangi chegirma qoidalari",

            prepay_from: "dan",
            prepay_to: "gacha",

            create_build: "Bino qo'shish",
            create_discount: "Chegirmani qo'shish",
            discounts: "Sotuv tarifi",

            choose_plan: "Xonadon rejasini tanlang",
        },

        placeholder: {
            name: "Obyekt nomi", address: "Obyekt manzili", full_address: "Shartnoma uchun manzil",

            type_plan: "Xonadon rejasi nomi",

            block_name: "Blok nomi",

            building_name: "Korpus nomi", credit_month: "Oylik to'lov uchun oylar soni",
        },
    },

    sweetAlert: {
        title: "Bu ishni amalga oshirishga aminmisiz?",
        text: "O'chirilsinmi?",
        text_copy_block: "Qavatni ko'chirishni hohlaysizmi?",
        yes: "Xa, o'chirilsin",
        yes_close: "Xa, yopilsin",
        yes_agree: "Xa, amalga oshirilsin",
        yes_clone: "Xa, ko'paytirilsin",
        no: "",
        deleted: "O'chirildi!",
        text_cancel_contract: "Shartnomani rostdan bekor qilmoqchimisiz?",
        yes_cancel_contract: "Xa, bekor qilish",
        canceled_contract: "Shartnoma bekor qilindi",
        payment_success: "To'lov muvaffaqiyatli qabul qilindi",
        payment_success_added: "To'lov muvaffaqiyatli qo'shildi",

        text_cancel_agree: "Rostdan ham bekor qilishni xoxlaysizmi?",
        text_agree: "Rostan ham shartnoma tuzishni hohlaysizmi?",

        text_cancel_reserve: "Rostdan ham band qilishni bekor qilmoqchimisiz?",
        yes_cancel_reserve: "Xa, bekor qilish",
        canceled_reserve: "Bandlik bekor qilindi",
        success_create_role: "Rol muvaffaqiyatli yaratildi",
        success_update_role: "Rol muvaffaqiyatli taxrirlandi",
        are_you_sure_delete_role: "Agar rolni o'chirmoqchi bo'lsangiz bu ro'ldagi foydalanuvchilar uchun yangi rol tanlashingiz kerak!", // 'text_cancel_contract': 'Вы действительно хотите расторгнуть контракт',
        payment_edit: "To'lovni taxrirlash",
        debtors: {
            payment_info: "To'lov summasi!",
            payment_edit: "To'lovni taxrirlash",
            payment_delete: "To'lovni rostdan xam bekor qilmoqchimisiz?",
            next: "Davom etish",
            are_you_sure: "Siz chindan ham to'lovni tasdiqlamoqchimisiz? Keyin bu amaliyotni bekor qilib bo'lmaydi!",
            yes: "Xa, to'lvoni tasdiqlayman",
            placeholder: "Agar to'lovga izohingiz bo'lsa yozing!",
        },
    },

    clients: {
        title: "Mijozlar bazasi",
        fio: "MIJOZ ISMI",
        phone: "Telefon raqami",
        amount: "NARX",
        apartment: "XONADON",
        object: "OBYEKT",
        file: "Shartnoma FAYLI",
        number: "Shartnoma raqami",
        language: "Til",
        date: "Sana",
        search: "Shartnoma raqami yoki mijozning telefon raqami orqali qidirish",
    },


    users: {
        title: "Foydalanuvchilar", name: "Ism", phone: "Telefon raqami", roles: "Rol", object: "Obyekt", login: "Login",
    },

    accountants: {
        title: "Xisob", role_title: "Xisob bo'limi",
    },

    cashier: {
        title: "G'aznachilar",
    },

    settings: {
        title: "Sozlamalar",
    },

    branches: {
        name: 'Filial',
        branch_name: 'Filial nomi',
        branch_address: 'Filial manzili',
        branch_phone: 'Filial telefon raqami',
        branch_manager: 'Filial menedjeri',
        manager_first_name: 'Menedjerning ismi',
        manager_last_name: 'Menedjerning familiyasi',
        manager_second_name: 'Menedjerning sharifi',
        manager_phone_number: 'Menedjerning telefon raqami',
        manager_email: 'Menedjerning elektron pochtasi',
        manager_avatar: 'Menedjerning profil surati',
    }
}