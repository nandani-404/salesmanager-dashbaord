import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface VehicleDetail {
  id: number;
  user_id: string;
  vehicle_id: string;
  vehicle_body: string;
  vehicle_type: string;
  registration_number: string;
  owner_name: string;
  father_name: string;
  permanent_address: string;
  registration_date: string;
  vehicle_category: string;
  vehicle_class: string;
  manufacturer: string;
  model: string;
  fuel_type: string;
  engine_number: string;
  chassis_number: string;
  color: string;
  seating_capacity: string;
  standing_capacity: string;
  cubic_capacity: string;
  gross_vehicle_weight: string;
  unladen_weight: string;
  fitness_valid_upto: string;
  insurance_company: string;
  insurance_policy_number: string;
  insurance_validity: string;
  pollution_valid_upto: string;
  road_tax_paid_upto: string;
  national_permit_number: string;
  national_permit_validity: string;
  state_permit_number: string;
  state_permit_validity: string;
  hypothecation: string;
  noc_details: string;
  blacklist_status: string;
  tax_status: string;
  rc_status: string;
  smart_card_issued: string;
  registration_valid_upto: string;
  previous_registration_number: string;
  rto_name: string;
  vehicle_location_state: string;
  vehicle_location_district: string;
  maker_model_description: string;
}

export async function generateVehiclePDF(vehicle: VehicleDetail): Promise<void> {
  // Create a temporary container with all content
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.width = "1200px";
  tempContainer.style.background = "white";
  tempContainer.style.padding = "40px";
  document.body.appendChild(tempContainer);

  // Styles with larger fonts
  const tableStyle = "width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 20px;";
  const cellLabelStyle = "padding: 12px 10px; color: #4b5563; width: 40%; vertical-align: top; font-size: 16px; line-height: 1.5; font-weight: 500;";
  const cellValueStyle = "padding: 12px 10px; font-weight: 600; width: 60%; white-space: normal; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; font-size: 16px; line-height: 1.5; color: #111827;";
  const rowStyle = "border-bottom: 1px solid #e5e7eb;";
  const headerStyle = "font-size: 22px; color: #1f2937; margin-bottom: 16px; padding-bottom: 8px; font-weight: 700;";

  // Build complete HTML content
  tempContainer.innerHTML = `
    <div style="font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(to right, #2563eb, #4f46e5); color: white; border-radius: 12px;">
        <h1 style="font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">Vehicle Details Report</h1>
        <p style="font-size: 20px; margin: 0; font-weight: 600;">${vehicle.registration_number}</p>
        <p style="font-size: 16px; margin: 10px 0 0 0; opacity: 0.9;">${vehicle.vehicle_id}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #2563eb;">Vehicle Information</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Manufacturer</td>
            <td style="${cellValueStyle}">${vehicle.manufacturer || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Model</td>
            <td style="${cellValueStyle}">${vehicle.model || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Fuel Type</td>
            <td style="${cellValueStyle}">${vehicle.fuel_type || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Color</td>
            <td style="${cellValueStyle}">${vehicle.color || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Vehicle Body</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_body || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">Vehicle Type</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_type || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #4f46e5;">Owner Information</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Owner Name</td>
            <td style="${cellValueStyle}">${vehicle.owner_name || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Father / Care Of</td>
            <td style="${cellValueStyle}">${vehicle.father_name || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">Permanent Address</td>
            <td style="${cellValueStyle}">${vehicle.permanent_address || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #ef4444;">Location</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">State</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_location_state || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">District</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_location_district || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #2563eb;">Technical Specifications</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Engine Number</td>
            <td style="${cellValueStyle}">${vehicle.engine_number || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Chassis Number</td>
            <td style="${cellValueStyle}">${vehicle.chassis_number || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Cubic Capacity</td>
            <td style="${cellValueStyle}">${vehicle.cubic_capacity || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Gross Vehicle Weight</td>
            <td style="${cellValueStyle}">${vehicle.gross_vehicle_weight ? `${vehicle.gross_vehicle_weight} kg` : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Unladen Weight</td>
            <td style="${cellValueStyle}">${vehicle.unladen_weight ? `${vehicle.unladen_weight} kg` : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Seating Capacity</td>
            <td style="${cellValueStyle}">${vehicle.seating_capacity || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">Standing Capacity</td>
            <td style="${cellValueStyle}">${vehicle.standing_capacity || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #2563eb;">Registration Details</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Registration Date</td>
            <td style="${cellValueStyle}">${vehicle.registration_date ? new Date(vehicle.registration_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Vehicle Category</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_category || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Vehicle Class</td>
            <td style="${cellValueStyle}">${vehicle.vehicle_class || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">RTO Name</td>
            <td style="${cellValueStyle}">${vehicle.rto_name || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">Registration Valid Upto</td>
            <td style="${cellValueStyle}">${vehicle.registration_valid_upto ? new Date(vehicle.registration_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #10b981;">Insurance & Validity</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Insurance Company</td>
            <td style="${cellValueStyle}">${vehicle.insurance_company || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Policy Number</td>
            <td style="${cellValueStyle}">${vehicle.insurance_policy_number || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Insurance Validity</td>
            <td style="${cellValueStyle}">${vehicle.insurance_validity ? new Date(vehicle.insurance_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Fitness Valid Upto</td>
            <td style="${cellValueStyle}">${vehicle.fitness_valid_upto ? new Date(vehicle.fitness_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">PUC Valid Upto</td>
            <td style="${cellValueStyle}">${vehicle.pollution_valid_upto ? new Date(vehicle.pollution_valid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">Road Tax Paid Upto</td>
            <td style="${cellValueStyle}">${vehicle.road_tax_paid_upto ? new Date(vehicle.road_tax_paid_upto).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #2563eb;">Permit Information</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">National Permit Number</td>
            <td style="${cellValueStyle}">${vehicle.national_permit_number || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">National Permit Validity</td>
            <td style="${cellValueStyle}">${vehicle.national_permit_validity ? new Date(vehicle.national_permit_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">State Permit Number</td>
            <td style="${cellValueStyle}">${vehicle.state_permit_number || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">State Permit Validity</td>
            <td style="${cellValueStyle}">${vehicle.state_permit_validity ? new Date(vehicle.state_permit_validity).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="${headerStyle} border-bottom: 3px solid #8b5cf6;">Additional Information</h2>
        <table style="${tableStyle}">
          <colgroup>
            <col style="width: 40%;">
            <col style="width: 60%;">
          </colgroup>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Hypothecation</td>
            <td style="${cellValueStyle}">${vehicle.hypothecation || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">NOC Details</td>
            <td style="${cellValueStyle}">${vehicle.noc_details || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Smart Card Issued</td>
            <td style="${cellValueStyle}">${vehicle.smart_card_issued || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Previous Reg Number</td>
            <td style="${cellValueStyle}">${vehicle.previous_registration_number || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Blacklist Status</td>
            <td style="${cellValueStyle}">${vehicle.blacklist_status || "N/A"}</td>
          </tr>
          <tr style="${rowStyle}">
            <td style="${cellLabelStyle}">Tax Status</td>
            <td style="${cellValueStyle}">${vehicle.tax_status || "N/A"}</td>
          </tr>
          <tr>
            <td style="${cellLabelStyle}">RC Status</td>
            <td style="${cellValueStyle}">${vehicle.rc_status || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      </div>
    </div>
  `;

  try {
    // Convert to canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      imageTimeout: 0,
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.85);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    // Generate blob and download
    const fileName = `vehicle-${vehicle.registration_number}-${Date.now()}.pdf`;
    const pdfBlob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);

    setTimeout(() => {
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(blobUrl);
      }, 200);
    }, 0);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
