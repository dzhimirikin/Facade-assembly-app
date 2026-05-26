import { db, storage } from "./firebase.js";
    /* ADD NEW */

    const newInputs =
      document.querySelectorAll(
        ".newPhoto"
      );

    for (const input of newInputs) {

      const file =
        input.files[0];

      if (!file) continue;

      if (
        updatedPhotos.length >= 3
      ) continue;

      const uploaded =
        await uploadPhoto(file);

      updatedPhotos.push(uploaded);

    }

    updatedPhotos =
      updatedPhotos
        .filter(p => p)
        .slice(0, 3);

    await updateDoc(

      doc(db, "assembly", id),

      {

        note,

        photos: updatedPhotos,

        timestamp: new Date()

      }

    );

    alert("Saved");

    window.close();

  }

  catch (error) {

    console.error(error);

    alert("Save error");

  }

}

/* =====================================================
   INIT
===================================================== */

window.addEventListener(

  "DOMContentLoaded",

  loadRecord

);
