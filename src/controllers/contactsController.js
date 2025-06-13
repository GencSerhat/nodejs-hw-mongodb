import { getAllContacts,getContactById } from "../services/contacts.js";

export const getAllContactsController = async (req, res) =>{
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status:200,
            message:'Succesfully found contacts!',
            data:contacts,
        });
    } catch (error) {
        console.error('Kontrolde hata oluştu : ', error.message);
        res.status(500).json({
            status:500,
            message:'Internal server error',
        });
    }
};

export const getContactByIdController = async (req, res) => {
  try {
    const { contactId } = req.params;

    // Şu an burada getContactById fonksiyonunu çağıracağız (services klasöründen)
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Kontak ID ile alınamadı:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
