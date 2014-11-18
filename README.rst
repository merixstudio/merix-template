****************
Pigie Framework
****************
(Nebula Framework Fork - 95fe22c)

.. warning::
   Dokumentacja w przygotowaniu


Cechy framworka
============

*//TODO:*/

Struktura katalogów (templates)
============

Szablony wywoływane zapytaniami AJAX umieszczamy w katalogu::

   /templates/ajax/

Fragmenty kodu, które są powielane w kilku miejscach w projekcie::

   /templates/elements/

Skrypty wrzucamy do pliku::

   /templates/elements/_scripts.html

Style wrzucamy do pliku::

   /templates/elements/_styles.html

Szablony podstron znajdują się w ::

   /templates/layouts/

Makra znajdziemy w::

   /templates/macros/

.. note::
   Plik został przygotowany tak, by nie było trzeba dokonywać w nim żadnych zmian w trakcie składania szablonu! Zostały w nim umieszczone style pomocnicze oraz style funkcjonalne dla dołączonych skryptów.

Zaimplementowane dodatkowe moduły
============

* widgets/accordions.js::
 Wykorzystuje: *nebula/viewport*
 
* widgets/select_field.js::
 Wykorzystuje: *detect, closest_scrollable, scrollable, offset_relative_to, safe_on*
 
* widgets/file_field.js::
 Wykorzystuje: *translate*
 
* widgets/input_counter.js::
 Wykorzystuje: *translate*

* widgets/media_set.js::
 Wykorzystuje: *throttle, image_loader, safe_on*
 
* widgets/modal.js::
 Wykorzystuje: *nebula/signal*
 