"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

/** Sublink interface */
interface Sublink {
  label: string;
  href: string;
  sublinks?: Sublink[];
}

/** Top-level category interface */
interface CategoryItemProps {
  name: string;
  href?: string;
  sublinks?: Sublink[];
}

/** A single category with optional sublinks */
const CategoryItem: React.FC<CategoryItemProps> = ({ name, href, sublinks }) => {
  // This state toggles the top-level dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref to store the close-timer so we can clear it if needed
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // On mouse enter, clear any pending timer and open immediately
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  // On mouse leave, wait 300ms before closing
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top-level link or button */}
      {href ? (
        <Link href={href} legacyBehavior>
          <a className="px-3 py-2 font-bold hover:underline inline-block">
            {name}
          </a>
        </Link>
      ) : (
        <button className="px-3 py-2 font-bold hover:underline inline-block">
          {name}
        </button>
      )}

      {/* If top-level sublinks exist, show them when isDropdownOpen is true */}
      {isDropdownOpen && sublinks && sublinks.length > 0 && (
        <div className="absolute left-0 top-full mt-2 bg-white text-black shadow-lg rounded-lg border border-gray-200 min-w-[180px]">
          <ul className="py-2">
            {sublinks.map((link, index) => (
              // Each sublink is its own group, so only that sublink's sub-sublinks open on hover
              <li key={index} className="relative px-4 py-2 hover:bg-gray-100 whitespace-nowrap group">
                <Link href={link.href} legacyBehavior>
                  <a className="block">{link.label}</a>
                </Link>

                {/* If this sublink has sub-sublinks, show them on hover of *this* li only */}
                {link.sublinks && link.sublinks.length > 0 && (
                  <ul className="absolute left-full top-0 mt-0 bg-white text-black shadow-lg rounded-lg border border-gray-200 hidden group-hover:block min-w-[180px]">
                    {link.sublinks.map((subLink, subIndex) => (
                      <li
                        key={subIndex}
                        className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                      >
                        <Link href={subLink.href} legacyBehavior>
                          <a className="block">{subLink.label}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};






/**
 * Example categories array (replace or import from your actual data)
 */

const categories: CategoryItemProps[] = [
  {

    name: "Business Cards",
    href: "/business-cards",
    sublinks: [
      {
        label: "Standard Business Cards",
        href: "/business-cards/Standard",
        sublinks: [
          { label: "14pt Profit Maximizer", href: "/business-cards/standard/14pt-profit-maximizer-bc" },
          { label: "14pt Matte Finish", href: "/business-cards/standard/14pt-matte-finish-bc" },
          { label: "16pt Matte Finish", href: "/business-cards/standard/16pt-matte-finish-bc" },
          { label: "Quick Ship", href: "/business-cards/standard/quick-ship-bc" },
          { label: "14pt UV (High Gloss)", href: "/business-cards/standard/14pt-uv-high-gloss-bc" },
          { label: "16pt UV (High Gloss)", href: "/business-cards/standard/16pt-uv-bc" },
          { label: "18pt Gloss Lamination", href: "/business-cards/standard/18pt-gloss-lamination-bc" },
          { label: "14pt + AQ", href: "/business-cards/standard/14pt-aq-bc" },
          { label: "18pt Writable (C1S)", href: "/business-cards/standard/18pt-writable-bc" },
          { label: "13pt Linen Uncoated", href: "/business-cards/standard/13pt-linen-bc" },
          { label: "14pt Writable + UV (C1S)", href: "/business-cards/standard/14pt-writable-bc" },
          { label: "18pt Matte Silk Lamination", href: "/business-cards/standard/18pt-matte-silk-lamination-bc" },
          { label: "16pt + AQ", href: "/business-cards/standard/16pt-aq-bc" },
          { label: "13pt Enviro Uncoated", href: "/business-cards/standard/13pt-enviro-bc" },
          { label: "14pt Writable + AQ (C1S)", href: "/business-cards/standard/14pt-writable-aq-bc" },
        ],
      },
      {
        label: "Specialty Business Cards",
        href: "business-cards/specialty",
        sublinks: [
          { label: "Metallic Foil", href: "/business-cards/specialty/metallic-foil" },
          { label: "Kraft Paper", href: "/business-cards/specialty/kraft-paper" },
          { label: "Durable", href: "/business-cards/specialty/durable-bc" },
          { label: "Spot UV (Raised)", href: "/business-cards/specialty/spot-uc-bc" },
          { label: "Pearl Paper", href: "/business-cards/specialty/pearl-paper-bc" },
          { label: "Die Cut", href: "/business-cards/specialty/die-cut-bc" },
          { label: "Soft Touch (Suede)", href: "/business-cards/specialty/soft-touch-bc" },
          { label: "32pt Painted Edge", href: "/business-cards/specialty/32pt-painted-edge-bc" },
          { label: "Ultrs Smooth", href: "/business-cards/specialty/ultra-smooth-bc" },
        ],
      },
    ],
  },
  {
    // Print Products
    name: "Print Products",
    href: "/print-products",
    sublinks: [
      {
        label: "Postcards",
        href: "/print-products/postcards",
        sublinks: [
          {
            label: "Matte Finish Postcards",
            href: "/print-products/postcards/matte-finish",
            sublinks: [
              { label: "10pt Matte Finish", href: "/print-products/postcards/matte-finish/10pt-matte-finish-pc" },
              { label: "14pt Matte Finish", href: "/print-products/postcards/matte-finish/14pt-matte-finish-pc" },
              { label: "16pt Matte Finish", href: "/print-products/postcards/matte-finish/16pt-matte-finish-pc" },
            ],
          },
          {
            label: "UV High Gloss Postcards",
            href: "/print-products/postcards/uv-high-gloss",
            sublinks: [
              { label: "14pt UV", href: "/print-products/postcards/uv-high-gloss/14pt-uv-pc" },
              { label: "16pt UV", href: "/print-products/postcards/uv-high-gloss/16pt-uv-pc" },
            ],
          },
          {
            label: "Lamination Postcards",
            href: "/print-products/postcards/lamination",
            sublinks: [
              { label: "18pt Gloss Lamination", href: "/print-products/postcards/lamination/18pt-gloss-lamination-pc" },
              { label: "18pt Matte Silk Lamination", href: "/print-products/postcards/lamination/18pt-matte-silk-lamination-pc" },
            ],
          },
          {
            label: "AQ Postcards",
            href: "/print-products/postcards/aq",
            sublinks: [
              { label: "10pt AQ", href: "/print-products/postcards/aq/10pt-aq-pc" },
              { label: "14pt AQ", href: "/print-products/postcards/aq/14pt-aq-pc" },
              { label: "16pt AQ", href: "/print-products/postcards/aq/16pt-aq-pc" },
            ],
          },
          {
            label: "Writable Postcards",
            href: "/print-products/postcards/writable",
            sublinks: [
              { label: "13pt Enviro Uncoated", href: "/print-products/postcards/writable/13pt-enviro-pc" },
              { label: "13pt Linen Uncoated", href: "/print-products/postcards/writable/13pt-linen-pc" },
              { label: "14pt Writable + AQ", href: "/print-products/postcards/writable/14pt-writable-aq-pc" },
              { label: "14pt Writable + UV", href: "/print-products/postcards/writable/14pt-writable-uv-pc" },
            ],
          },
          {
            label: "Specialty Postcards",
            href: "/print-products/postcards/specialty",
            sublinks: [
              { label: "Metallic Foil", href: "/print-products/postcards/specialty/metallic-foil-pc" },
              { label: "Spot UV", href: "/print-products/postcards/specialty/spot-uv-pc" },
              { label: "Kraft Paper", href: "/print-products/postcards/specialty/kraft-paper-pc" },
              { label: "Pearl Paper", href: "/print-products/postcards/specialty/pearl-paper-pc" },
              { label: "Durable", href: "/print-products/postcards/specialty/durable-pc" },
            ],
          },
        ],
      },
      {
        label: "Flyers",
        href: "/print-products/flyers",
        sublinks: [
          { label: "100lb Gloss Text", href: "/print-products/flyers/100lb-gloss-text-f" },
          { label: "100lb Matte Finish", href: "/print-products/flyers/100lb-matte-f" },
          { label: "100lb UV", href: "/print-products/flyers/100lb-uv-f" },
          { label: "80lb Enviro Uncoated", href: "/print-products/flyers/80lb-enviro-f" },
          { label: "70lb Linen Uncoated", href: "/print-products/flyers/70lb-linen-f" },
        ],
      },
      {
        label: "Brochures",
        href: "/print-products/brochures",
        sublinks: [
          { label: "100lb Gloss Text", href: "/print-products/brochures/100lb-gloss-text-b" },
          { label: "100lb Matte Finish", href: "/print-products/brochures/100lb-matte-b" },
          { label: "100lb UV", href: "/print-products/brochures/100lb-uv-b" },
          { label: "80lb Enviro Uncoated", href: "/print-products/brochures/80lb-enviro-b" },
        ],
      },
      {
        label: "Bookmarks",
        href: "/print-products/bookmarks",
        sublinks: [
          {
            label: "Matte Bookmarks",
            href: "/print-products/bookmarks/matte",
            sublinks: [
              { label: "10pt Matte Finish", href: "/print-products/bookmarks/matte/10pt-matte-bm" },
              { label: "14pt Matte Finish", href: "/print-products/bookmarks/matte/14pt-matte-bm" },
              { label: "16pt Matte Finish", href: "/print-products/bookmarks/matte/16pt-matte-bm" },
            ],
          },
          {
            label: "UV (High Gloss) Bookmarks",
            href: "/print-products/bookmarks/uv",
            sublinks: [
              { label: "14pt UV (High Gloss)", href: "/print-products/bookmarks/uv/14pt-uv-bm" },
              { label: "16pt UV (High Gloss)", href: "/print-products/bookmarks/uv/16pt-uv-bm" },
            ],
          },
          {
            label: "Lamination Bookmarks",
            href: "/print-products/bookmarks/lamination",
            sublinks: [
              { label: "18pt Matte With Silk Lamination", href: "/print-products/bookmarks/lamination/18pt-matte-silk-lamination-bm" },
              { label: "18pt Gloss Lamination", href: "/print-products/bookmarks/lamination/18pt-gloss-lamination-bm" },
            ],
          },
          {
            label: "Specialty Bookmarks",
            href: "/print-products/bookmarks/specialty",
            sublinks: [
              { label: "13pt Enviro Uncoated", href: "/print-products/bookmarks/specialty/13pt-enviro-bm" },
              { label: "13pt Linen Uncoated", href: "/print-products/bookmarks/specialty/13pt-linen-bm" },
              { label: "14pt Writable + UV (C1S)", href: "/print-products/bookmarks/specialty/14pt-writable-uv-bm" },
              { label: "18pt Matte Lam + Spot UV", href: "/print-products/bookmarks/specialty/18pt-matt-lam-spot-uv-bm" },
            ],
          },
        ],
      },
        {
          label: "Presentation Folders",
          href: "/print-products/presentation-folders",
          sublinks: [
            { label: "14pt Matte Lamination", href: "/print-products/presentation-folders/14pt-matte-lam-pf" },
            { label: "14pt Standard AQ", href: "/print-products/presentation-folders/14pt-standard-aq-pf" },
            { label: "Metallic Foil", href: "/print-products/presentation-folders/metallic-foil-pf" },
          ],
        },
        {
          label: "Booklets",
          href: "/print-products/booklets",
          sublinks: [
            {
              label: "8.5 x 11",
              href: "/print-products/booklets/8.5-x-11",
              sublinks: [
                { label: "80lb Silk Text", href: "/print-products/booklets/8.5-x-11/80b-silk-text-bk" },
                { label: "100lb Silk Text", href: "/print-products/booklets/8.5-x-11/100lb-silk-text-bk" },
                { label: "80lb Gloss Text", href: "/print-products/booklets/8.5-x-11/80lb-gloss-text-bk" },
                { label: "100lb Gloss Text", href: "/print-products/booklets/8.5-x-11/100lb-gloss-text-bk" },
              ],
            },
            {
              label: "8.5 x 5.5",
              href: "/print-products/booklets/8.5-x-5.5",
              sublinks: [
                { label: "80lb Silk Text", href: "/print-products/booklets/8.5-x-5.5-80lb-silk-text-bk" },
                { label: "100lb Silk Text", href: "/print-products/booklets/8.5-x-5.5-100lb-silk-text-bk" },
                { label: "80lb Gloss Text", href: "/print-products/booklets/8.5-x-5.5/80lb-gloss-text-gloss-text-bk" },
                { label: "100lb Gloss Text", href: "/print-products/booklets/8.5-x-5.5-100lb-gloss-text-bk" },
              ],
            },
          ],
        },
        {
          label: "Magnets",
          href: "/print-products/magnets",
          sublinks: [
            { label: "14pt magnets", href: "/print-products/magnets/14pt-magnets" },
            { label: "30mil Car Magnets", href: "/print-products/magnets/30mil-car-magnets" },
            { label: "30mil Cut To Shape Magnets", href: "/print-products/magnets/30mil-magnets" },
            { label: "20mil Cut To Shape Magnets", href: "/print-products/magnets/20mil-magnets" },
          ],
        },
        {
          label: "Greeting Cards",
          href: "/print-products/greeting-cards",
          sublinks: [
            {
              label: "Standard Greeting Cards",
              href: "/print-products/greeting-cards/standard",
              sublinks: [
                { label: "14pt + Matte Finish", href: "/print-products/greeting-cards/standard/14pt-matte-gc" },
                { label: "14pt + UV (High Gloss)", href: "/print-products/greeting-cards/standard/14pt-uv-gc" },
                { label: "14pt + AQ", href: "/print-products/greeting-cards/standard/14pt-aq-gc" },
                { label: "13pt Enviro Uncoated", href: "/print-products/greeting-cards/standard/13pt-enviro-gc" },
                { label: "14pt Writable + AQ (C1S)", href: "/print-products/greeting-cards/standard/14pt-writable-aq-gc" },
                { label: "14pt Writable + UV (C1S)", href: "/print-products/greeting-cards/standard/14pt-writable-uv-gc" },
              ],
            },
            {
              label: "Specialty Greeting Cards",
              href: "/print-products/greeting-cards/specialty",
              sublinks: [
                { label: "Metallic Foil", href: "/print-products/greeting-cards/specialty/metallic-foil-gc" },
                { label: "Spot UV", href: "/print-products/greeting-cards/specialty/spot-uv-gc" },
                { label: "Kraft Paper", href: "/print-products/greeting-cards/specialty/kraft-paper-gc" },
                { label: "Pearl Paper", href: "/print-products/greeting-cards/specialty/pearl-paper-gc" },
              ],
            },
          ],
        },
        {
          label: "Invitations / Announcements",
          href: "/print-products/invitations",
          sublinks: [
            { label: "14pt Matte Finish", href: "/print-products/invitations/14pt-matte-finish-ia" },
            { label: "14pt Writable + AQ (C1S)", href: "/print-products/invitations/14pt-writable-aq-ia" },
            { label: "14pt AQ", href: "/print-products/invitations/14pt-aq-ia" },
            { label: "14pt UV", href: "/print-products/invitations/14pt-uv-ia" },
            { label: "Kraft Paper", href: "/print-products/invitations/kraft-paper-ia" },
            { label: "Pearl Paper", href: "/print-products/invitations/pearl-paper-ia" },
            { label: "Metallic Foil", href: "/print-products/invitations/metallic-foil-ia" },
          ],
        },
        {
          label: "Numbered Tickets",
          href: "/print-products/numbered-tickets",
          sublinks: [
            { label: "14pt Numbered Tickets", href: "/print-products/numbered-tickets/14pt-numbered-tickets" },
          ],
        },
        {
          label: "Wall Calendars",
          href: "/print-products/wall-calendars",
          sublinks: [
            { label: "80lb Gloss Text", href: "/print-products/wall-calendars/80lb-gloss-text-wc" },
            { label: "100lb Gloss Text", href: "/print-products/wall-calendars/100lb-gloss-text-wc" },
          ],
        },
        {
          label: "Variable Printing",
          href: "/print-products/variable",
          sublinks: [
            { label: "14pt Variable Printing", href: "/print-products/variable,14pt-variable" },
          ],
        },
        {
          label: "Posters",
          href: "/print-products/posters",
          sublinks: [
            { label: "100lb Gloss Text", href: "/print-products/posters/100lb-gloss-text-post" },
            { label: "100lb Matte Finish", href: "/print-products/posters/100lb-matte-post" },
            { label: "100lb UV (High Gloss)", href: "/print-products/posters/100lb-uv-post" },
            { label: "80lb Enviro Uncoated", href: "/print-products/posters/80lb-enviro-post" },
            { label: "8pt C2S Stock Large Format", href: "/print-products/posters/8pt-post" },
          ],
        },
        {
          label: "Door Hangers",
          href: "/print-products/door-hangers",
          sublinks: [
            { label: "AQ Door Hangers", href: "/print-products/door-hangers/14pt-aq-dh" },
            { label: "14pt UV (High Gloss)", href: "/print-products/door-hangers/14pt-uv-dh" },
            { label: "14pt Matte", href: "/print-products/door-hangers/14pt-matte-dh" },
            { label: "13pt Enviro Uncoated", href: "/print-products/door-hangers/13pt-enviro-dh" },
          ],
        },
        {
          label: "Digital Sheets",
          href: "/print-products/digital-sheets",
          sublinks: [
            {
              label: "Matte Digital Sheets",
              href: "/print-products/digital-sheets/matte",
              sublinks: [
                { label: "14pt Matte Finish", href: "/print-products/digital-sheets/matte/14pt-matte-ds" },
                { label: "100lb Matte Finish", href: "/print-products/digital-sheets/matte/100lb-matte-ds" },
              ],
            },
            {
              label: "Specialty Digital Sheets",
              href: "/print-products/digital-sheets/specialty",
              sublinks: [
                { label: "80lb Enviro Uncoated", href: "/print-products/digital-sheets/specialty/80lb-enviro-ds" },
                { label: "13pt Enviro Uncoated", href: "/print-products/digital-sheets/specialty/13pt-enviro-ds" },
                { label: "100lb Gloss Text", href: "/print-products/digital-sheets/specialty/100lb-gloss-text-ds" },
              ],
            },
          ],
        },
        {
          label: "Folded Business Cards",
          href: "/print-products/folded-business-cards",
          sublinks: [
            { label: "14pt UV (High Gloss)", href: "/print-products/folded-business-cards/14pt-uv-fb" },
            { label: "14pt Matte Finish", href: "/print-products/folded-business-cards/14pt-matte-fb" },
            { label: "13pt Enviro Uncoated", href: "/print-products/folded-business-cards/13pt-enviro-fb" },
          ],
        },
        {
          label: "Tent Cards",
          href: "/print-products/tent-cards",
          sublinks: [
            { label: "14pt Matte Finish", href: "/print-products/tent-cards/14pt-matte-tc" },
          ],
        },
        {
          label: "Plastics",
          href: "/print-products/plastics",
          sublinks: [
            { label: "14pt Plastics", href: "/print-products/plastics/14pt-plastics" },
          ],
        },
        {
          label: "Tear Cards",
          href: "/print-products/tear-cards",
          sublinks: [
            { label: "14pt UV (High Gloss)", href: "/print-products/tear-cards/14pt-uv-tear" },
            { label: "14pt Matte Finish", href: "/print-products/tear-cards/14pt-matte-tear" },
            { label: "13pt Enviro Uncoated", href: "/print-products/tear-cards/13pt-enviro-tear" },
          ],
        },
        {
          label: "Clings",
          href: "/print-products/clings",
          sublinks: [
            { label: "Transparent Clings", href: "/print-products/clings/transparent-clings" },
            { label: "White Opaque Clings", href: "/print-products/clings/white-opaque-clings" },
          ],
        },
      ],
    },  
      {
          // New Category Large Format
          name: "Large Format",
          href: "/large-format",
          sublinks: [
            {
              label: "Coroplast Signs",
              href: "/large-format/coroplast",
              sublinks: [
                { label: "4mm Coroplast", href: "/large-format/coroplast/4mm-coroplast" },
                { label: "6mm Coroplast", href: "/large-format/coroplast/6mm-coroplast" },
                { label: "8mm Coroplast", href: "/large-format/coroplast/8mm-coroplast" },
                { label: "10mm Coroplast", href: "/large-format/coroplast/10mm-coroplast" },
              ],
            },
            {
              label: "Floor Graphics",
              href: "/large-format/floor-graphics",
              sublinks: [
                { label: "Custom Floor Graphics", href: "/large-format/floor-graphics/custom-floor-graphics" },
                { label: "Directional Floor Graphics", href: "/large-format/floor-graphics/directional-floor-graphics" },
              ],
            },
            {
              label: "Foam Board",
              href: "/large-format/foam-board",
              sublinks: [
                { label: "4mm Foam Board", href: "/large-format/foam-board/4mm-foam-board" },
              ],
            },
            {
              label: "Banners",
              href: "/large-format/banners",
              sublinks: [
                { label: "13oz Matte Vinyl", href: "/large-format/banners/13oz-matte-vinyl-banners" },
                { label: "13oz Glossy Vinyl", href: "/large-format/banners/13oz-glossy-vinyl-banners" },
                { label: "8oz Polyester Mesh", href: "/large-format/banners/8oz-mesh-banners" },
              ],
            },
            {
              label: "Pull Up Banners",
              href: "/large-format/pull-up-banners",
              sublinks: [
                {
                  label: "Standard Pull up Banners",
                  href: "/large-format/pull-up-banners/standard",
                  sublinks: [
                    { label: "13oz Matte Vinyl Black Base", href: "/large-format/pull-up-banners/standard/13oz-matte-black-base" },
                    { label: "13oz Matte Vinyl Silver Base", href: "/large-format/pull-up-banners/standard/13oz-matte-silver-base" },
                  ],
                },
                {
                  label: "Premium Pull Up Banners",
                  href: "/large-format/pull-up-banners/premium",
                  sublinks: [
                    { label: "13oz Matte Vinyl Premium Stand", href: "/large-format/pull-up-banners/premium/13oz-matte-premium-stand" },
                  ],
                },
                {
                  label: "Table Top Pull Up Banners",
                  href: "/large-format/pull-up-banners/table-top",
                  sublinks: [
                    { label: "13oz Matte Vinyl", href: "/large-format/pull-up-banners/table-top/13oz-matte-table-top" },
                  ],
                },
                {
                  label: "Wide Premium Banners",
                  href: "/large-format/pull-up-banners/wide-premium",
                  sublinks: [
                    { label: "13oz Matte Vinyl Wide Premium", href: "/large-format/pull-up-banners/wide-premium/13oz-matte-vinyl-wide-premium" },
                  ],
                },
                {
                  label: "Double Sided Pull Up Banners",
                  href: "/large-format/pull-up-banners/double-sided",
                  sublinks: [
                    { label: "Double Sided Pull Banners", href: "/large-format/pull-up-banners/double-sided/13oz-double-sided-banners" },
                  ],
                },
                {
                  label: "X-Frame Banners",
                  href: "/large-format/x-frame",
                  sublinks: [
                    { label: "13oz Matte Vinyl", href: "/large-format/x-frame/13oz-matte-x-frame" },
                  ],
                },
              ],
            },
            {
              label: "Aluminum Signs",
              href: "/large-format/aluminum-signs",
              sublinks: [
                { label: "3mm Aluminum Signs", href: "/large-format/aluminum-signs/3mm-aluminum-signs" },
              ],
            },
            {
              label: "Table Covers",
              href: "/large-format/table-covers",
              sublinks: [
                { label: "6ft Table Covers", href: "/large-format/table-covers/6ft-table-covers" },
                { label: "8ft Table Covers", href: "/large-format/table-covers/8ft-table-covers" },
              ],
            },
            {
              label: "Adhesive Vinyl",
              href: "/large-format/adhesive-vinyl",
              sublinks: [
                { label: "Glossy Adhesive Vinyl", href: "/large-format/adhesive-vinyl/glossy-adhesive-vinyl" },
              ],
            },
            {
              label: "Window Graphics",
              href: "/large-format/window-graphics",
              sublinks: [
                { label: "Perforated Vinyl", href: "/large-format/window-graphics/perforated-vinyl" },
              ],
            },
            {
              label: "Styrene Signs",
              href: "/large-format/styrene",
              sublinks: [
                { label: "20pt Styrene", href: "/large-format/styrene/20pt-styrene" },
              ],
            },
            {
              label: "Display Board",
              href: "/large-format/display-board",
              sublinks: [
                { label: "24pt Display Board", href: "/large-format/display-board/24pt-display-board" },
                { label: "40pt Display Board", href: "/large-format/display-board/40pt-display-board" },
              ],
            },
            {
              label: "Canvas",
              href: "/large-format/canvas",
              sublinks: [
                { label: "Rolled Canvas", href: "/large-format/canvas/rolled-canvas" },
                { label: "Stretched Canvas", href: "/large-format/canvas/stretched-canvas" },
              ],
            },
            {
              label: "Sintra / PVC",
              href: "/large-format/sintra",
              sublinks: [
                { label: "3mm PVC", href: "/large-format/sintra/3mm-pvc" },
              ],
            },
            {
              label: "A-Frame Signs",
              href: "/large-format/a-frame",
              sublinks: [
                { label: "4mm Coroplast", href: "/large-format/a-frame/4mm-coroplast-a-frame" },
              ],
            },
            {
              label: "Wall Decals",
              href: "/large-format/wall-decals",
              sublinks: [
                { label: "7mm Removable Wall Decals", href: "/large-format/wall-decals/7mm-removable-wall-decals" },
              ],
            },
            {
              label: "A-frame Stands",
              href: "/large-format/a-frame-stands",
              sublinks: [
                { label: "A Frame Stands", href: "/large-format/a-frame-stands/a-frame-stands" },
              ],
            },
            {
              label: "H Stands",
              href: "/large-format/h-stands",
              sublinks: [
                { label: "H Stands", href: "/large-format/h-stands/h-stands" },
              ],
            },
          ],
        },  
          {
            // New Category Stationary
            name: "Stationary",
            href: "/stationary",
            sublinks: [
              {
                label: "Letterhead",
                href: "/stationary/letterhead",
                sublinks: [
                  { label: "60lb Uncoated", href: "/stationary/letterhead/60lb-uncoated-letterhead" },
                ],
              },
              {
                label: "Envelopes",
                href: "/stationary/envelopes",
                sublinks: [
                  { label: "60lb Uncoated", href: "/stationary/envelopes/60lb-uncoated-env" },
                  { label: "60lb Uncoated Self-Adhesive", href: "/stationary/envelopes/60lb-uncoated-self-adhesive-env" },
                  { label: "60lb Uncoated Security", href: "/stationary/envelopes/60lb-uncoated-seurity-rnv" },
                ],
              },
              {
                label: "Notepads",
                href: "/stationary/notepads",
                sublinks: [
                  { label: "60lb Uncoated 25 Pages", href: "/stationary/notepads/60lb-uncoated-25-pages-np" },
                  { label: "60lb Uncoated 50 Pages", href: "/stationary/notepads/60lb-uncoated-50-pages-np" },
                ],
              },
              {
                label: "NCR Forms",
                href: "/stationary/ncr",
                sublinks: [
                  { label: "3 Part NCR Forms", href: "/stationary/ncr/3-part-ncr-forms" },
                ],
              },
            ],
          },
          {
            // New Category Labels and Packaging
            name: "Labels And Packaging",
            href: "/stationary/labels-and-packaging",
            sublinks: [
              {
                label: "Roll Labels",
                href: "/stationary/labels-and-packaging/labels",
                sublinks: [
                  { label: "BOPP Roll Labels", href: "/labels-and-packaging/labels/bopp-roll-labels" },
                  { label: "Polly Roll Labels", href: "/labels-and-packaging/labels/polly-roll-labels" },
                  { label: "Paper Roll Labels", href: "/labels-and-packaging/labels/paper-roll-labels" },
                ],
              },
              {
                label: "Corrugated Boxes",
                href: "/labels-and-packaging/corrugated",
                sublinks: [
                  { label: "Mailer Boxes", href: "/labels-and-packaging/corrugated/mailer-boxes" },
                ],
              },
              {
                label: "Product Boxes",
                href: "/labels-and-packaging/product-boxes",
                sublinks: [
                  { label: "Straight Tuck End (STE)", href: "/labels-and-packaging/product-boxes/ste" },
                  { label: "Reverse Tuck End (RTE)", href: "/labels-and-packaging/product-boxes/rte" },
                  { label: "Auto Lock Bottom (ALB)", href: "/labels-and-packaging/product-boxes/alb" },
                  { label: "Product Box Sleeves", href: "/labels-and-packaging/product-boxes/product-box-sleeves" },
                ],
              },
              {
                label: "Flexible Packaging",
                href: "/labels-and-packaging/flexible",
                sublinks: [
                  { label: "Stand Up Pouches", href: "/labels-and-packaging/flexible/stand-up-pouches" },
                  { label: "Lay Flat Pouches", href: "/labels-and-packaging/flexible/lay-flat-pouches" },
                ],
              },
            ],
          },
        
      
              // New Category Promotional
          {
                name: "Promotional",
              href: "/promotional",
              sublinks: [
                {
                  label: "Keychains",
                  href: "/promotional/keychains",
                  sublinks: [
                    { label: "Keychains (Pack Of 10)", href: "/promotional/keychains" },
                  ],
                },
                {
                  label: "Coasters",
                  href: "/promotional/coasters",
                  sublinks: [
                    { label: "Coasters Square (Pack Of 10)", href: "/promotional/coasters/square-coasters-10" },
                    { label: "Coasters Round (Pack Of 4)", href: "/promotional/coasters/round-coasters-4" },
                    { label: "Coasters Hexagon (Pack Of 4)", href: "/promotional/coasters/hexagon-coasters-4" },
                    { label: "Coasters Square (Pack Of 4)", href: "/promotional/coasters/square-coasters-4" },
                  ],
                },
                {
                  label: "Mouse Pads",
                  href: "/promotional/mouse-pads",
                  sublinks: [
                    { label: "Mouse Pads", href: "/promotional/mouse-pads/mouse-pads" },
                  ],
                },
              ],
            },
            {
              // New Category Gifts
              name: "Gifts",
              href: "/gifts",
              sublinks: [
                {
                  label: "Mugs",
                  href: "/gifts/mugs",
                  sublinks: [
                    { label: "11oz Ceramic Mugs", href: "/gifts/mugs/11oz-ceramic-mug" },
                    { label: "15oz Ceramic Mugs", href: "/gifts/mugs/15oz-ceramic-mug" },
                    { label: "10oz Stainless Steel Mugs", href: "/gifts/mugs/10oz-stainless-steel-mug" },
                    { label: "18oz Clear Beer Mugs", href: "/gifts/mugs/18oz-clear-beer-mug" },
                    { label: "16oz Frosted Beer Mugs", href: "/gifts/mugs/16oz-frosted-beer-mug" },
                  ],
                },
                {
                  label: "Bottles",
                  href: "/gifts/bottles",
                  sublinks: [
                    { label: "17oz Stainless Steel Bottles", href: "/gifts/bottles/17oz-stainless-steel-bottle" },
                  ],
                },
                {
                  label: "Glasses",
                  href: "/gifts/glasses",
                  sublinks: [
                    { label: "18oz Frosted Drinking Glass", href: "/gifts/glasses/18oz-glass" },
                  ],
                },
                {
                  label: "Tumblers",
                  href: "/gifts/tumblers",
                  sublinks: [
                    { label: "20oz Skinny Tumbler", href: "/gifts/tumblers/20oz-skinny-tumbler" },
                  ],
                },
                {
                  label: "Photo Panels",
                  href: "/gifts/photo",
                  sublinks: [
                    { label: "Photo Cube", href: "/gifts/photo/photo-cube" },
                    { label: "Photo Slate (Stone)", href: "/gifts/photo/photo-slate" },
                    { label: "Clear LED Photo Panel", href: "/gifts/photo/clear-led-photo" },
                    { label: "Clear Crystal Photo Panel", href: "/gifts/photo/clear-crystal-photo" },
                  ],
                },
                {
                  label: "Puzzles",
                  href: "/gifts/puzzles",
                  sublinks: [
                    { label: "Puzzles", href: "/gifts/puzzles/puzzles" },
                  ],
                },
              ],
            },
            {
              // New Category Apparel
              name: "Apparel",
              href: "/apparel",
              sublinks: [
                {
                  label: "Mens Clothing",
                  href: "/apparel/mens",
                  sublinks: [
                    { label: "T-Shirts", href: "/apparel/mens/mens-t-shirts" },
                    { label: "Long Sleeve Shirts", href: "/apparel/mens/mens-long-sleeve" },
                    { label: "Sweatshirts", href: "/apparel/mens/mens-sweatshirts" },
                    { label: "Hoodies", href: "/apparel/mens/mens-hoodies" },
                    { label: "Tank Tops", href: "/apparel/mens/mens-tank-tops" },
                    { label: "Polos", href: "/apparel/mens/mens-polos" },
                  ],
                },
                {
                  label: "Womens Clothing",
                  href: "/apparel/womens",
                  sublinks: [
                    { label: "T-Shirts", href: "/apparel/womens/womens-t-shirts" },
                    { label: "Long Sleeve Shirts", href: "/apparel/womens/womens-long-sleeve-shirts" },
                    { label: "Tank Tops", href: "/apparel/womens/womens-tank-tops" },
                    { label: "Polos", href: "/apparel/womens/womens-polos" },
                  ],
                },
                {
                  label: "Kids Clothing",
                  href: "/apparel/kids",
                  sublinks: [
                    { label: "T-Shirts", href: "/apparel/kids/kids-t-shirt" },
                    { label: "Long Sleeve Shirts", href: "/apparel/kids/kids-long-sleeve-shirt" },
                    { label: "Sweatshirts", href: "/apparel/kids/kids-sweatshirts" },
                    { label: "Hoodies", href: "/apparel/kids/kids-hoodies" },
                  ],
                },
                {
                  label: "Headwear",
                  href: "/apparel/headwear",
                  sublinks: [
                    { label: "Embroidered Hats", href: "/apparel/headwear/embroidered-hats" },
                    { label: "Embroidered Beanies", href: "/apparel/headwear/embroidered-beanies" },
                  ],
                },
                {
                  label: "Accessories",
                  href: "/apparel/accessories",
                  sublinks: [
                    { label: "Totes", href: "/apparel/accessories/totes" },
                  ],
                },
              ],
            },
          ]

          // Use the categories variable in your component
/** Renders the navbar horizontally across the top */
const NavbarCategories: React.FC = () => {
  return (
    <nav className="relative z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center space-x-4 py-2">
      {categories.map((cat, idx) => (
        <CategoryItem
          key={idx}
          name={cat.name}
          href={cat.href}
          sublinks={cat.sublinks}
        />
      ))}
    </nav>
  );
};

export default NavbarCategories;